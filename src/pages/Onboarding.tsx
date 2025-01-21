import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateWorkoutPlan, generateNutritionPlan } from '../lib/openai';

interface OnboardingData {
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    age: 25,
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    goal: 'weight_loss',
    activityLevel: 'moderate',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'currentWeight' || name === 'targetWeight'
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Save profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          height: formData.height,
          current_weight: formData.currentWeight,
          target_weight: formData.targetWeight,
          birth_date: new Date(new Date().getFullYear() - formData.age, 0, 1),
        });

      if (profileError) throw profileError;

      // Add initial weight log
      await supabase
        .from('weight_logs')
        .insert({
          profile_id: user.id,
          weight: formData.currentWeight,
        });

      // Generate personalized programs
      const [workoutPlan, nutritionPlan] = await Promise.all([
        generateWorkoutPlan(formData),
        generateNutritionPlan(formData)
      ]);

      // Save workout program
      for (const week of workoutPlan.weeks) {
        for (const workout of week.workouts) {
          const { data: workoutData, error: workoutError } = await supabase
            .from('workouts')
            .insert({
              profile_id: user.id,
              name: workout.name,
              date: new Date(Date.now() + (week.week_number - 1) * 7 * 24 * 60 * 60 * 1000 + (workout.day - 1) * 24 * 60 * 60 * 1000)
            })
            .select()
            .single();

          if (workoutError) throw workoutError;

          // Save exercises for this workout
          const exercises = workout.exercises.map(exercise => ({
            workout_id: workoutData.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
          }));

          const { error: exercisesError } = await supabase
            .from('exercises')
            .insert(exercises);

          if (exercisesError) throw exercisesError;
        }
      }

      // Store nutrition plan in local storage for now
      // In a real app, we would create proper tables for meal plans
      localStorage.setItem(`nutrition_plan_${user.id}`, JSON.stringify(nutritionPlan));

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Informations de base</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Âge</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
              Suivant
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Objectifs de poids</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Poids actuel (kg)</label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Poids cible (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
              Suivant
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Objectif et activité</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Objectif principal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="weight_loss">Perte de poids</option>
                <option value="muscle_gain">Prise de masse musculaire</option>
                <option value="maintenance">Maintien du poids</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Niveau d'activité</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="sedentary">Sédentaire</option>
                <option value="light">Légèrement actif</option>
                <option value="moderate">Modérément actif</option>
                <option value="very_active">Très actif</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Génération de votre programme...' : 'Terminer'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;