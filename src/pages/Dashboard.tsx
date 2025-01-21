import React from 'react';
import { Activity, Weight, Target, Calendar, TrendingUp, Utensils } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  weightProgress: [
    { date: '01/03', weight: 85 },
    { date: '08/03', weight: 84 },
    { date: '15/03', weight: 83.2 },
    { date: '22/03', weight: 82.5 },
    { date: '29/03', weight: 81.8 },
  ],
  todayWorkout: {
    name: "Programme Force & Cardio",
    exercises: [
      { name: "Squats", sets: 4, reps: 12 },
      { name: "Pompes", sets: 3, reps: 15 },
      { name: "Planche", duration: "45 secondes", sets: 3 },
      { name: "Course", duration: "20 minutes", intensity: "modérée" }
    ]
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue ! Voici votre progression</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Weight className="h-6 w-6 text-purple-600" />}
            title="Poids actuel"
            value="81.8 kg"
            change="-3.2 kg"
            trend="positive"
          />
          <StatCard
            icon={<Target className="h-6 w-6 text-purple-600" />}
            title="Objectif"
            value="75 kg"
            remaining="-6.8 kg"
          />
          <StatCard
            icon={<Activity className="h-6 w-6 text-purple-600" />}
            title="Calories brûlées"
            value="2,847 kcal"
            period="cette semaine"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weight Progress Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression du poids</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.weightProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#9333EA"
                    strokeWidth={2}
                    dot={{ fill: '#9333EA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Workout */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Programme du jour</h2>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-700">{mockData.todayWorkout.name}</h3>
              </div>
              {mockData.todayWorkout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <span className="text-gray-700">{exercise.name}</span>
                  <span className="text-gray-500">
                    {exercise.sets}x{exercise.reps || exercise.duration}
                  </span>
                </div>
              ))}
              <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Commencer la séance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, trend, remaining, period }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-purple-50 p-2 rounded-lg">{icon}</div>
      {trend && (
        <span className={`text-sm ${trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
    {remaining && <p className="text-sm text-gray-500 mt-1">Reste {remaining}</p>}
    {period && <p className="text-sm text-gray-500 mt-1">{period}</p>}
  </div>
);

export default Dashboard;