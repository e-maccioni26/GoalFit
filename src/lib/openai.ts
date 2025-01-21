import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface UserProfile {
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
}

export async function generateWorkoutPlan(profile: UserProfile) {
  const prompt = `En tant que coach sportif professionnel, crée un programme d'entraînement personnalisé pour une personne avec les caractéristiques suivantes:

Age: ${profile.age} ans
Taille: ${profile.height} cm
Poids actuel: ${profile.currentWeight} kg
Poids cible: ${profile.targetWeight} kg
Objectif: ${profile.goal === 'weight_loss' ? 'Perte de poids' : profile.goal === 'muscle_gain' ? 'Prise de masse musculaire' : 'Maintien du poids'}
Niveau d'activité: ${profile.activityLevel}

Génère un programme d'entraînement sur 4 semaines avec 3 séances par semaine. Pour chaque exercice, spécifie:
- Nom de l'exercice
- Nombre de séries
- Nombre de répétitions ou durée
- Temps de repos entre les séries

Format de réponse souhaité en JSON:
{
  "program_name": "Nom du programme",
  "weeks": [
    {
      "week_number": 1,
      "workouts": [
        {
          "day": 1,
          "name": "Nom de la séance",
          "exercises": [
            {
              "name": "Nom de l'exercice",
              "sets": 3,
              "reps": 12,
              "rest": "90s"
            }
          ]
        }
      ]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Tu es un coach sportif professionnel spécialisé dans la création de programmes d'entraînement personnalisés."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateNutritionPlan(profile: UserProfile) {
  const prompt = `En tant que nutritionniste professionnel, crée un plan nutritionnel personnalisé pour une personne avec les caractéristiques suivantes:

Age: ${profile.age} ans
Taille: ${profile.height} cm
Poids actuel: ${profile.currentWeight} kg
Poids cible: ${profile.targetWeight} kg
Objectif: ${profile.goal === 'weight_loss' ? 'Perte de poids' : profile.goal === 'muscle_gain' ? 'Prise de masse musculaire' : 'Maintien du poids'}
Niveau d'activité: ${profile.activityLevel}

Génère un plan nutritionnel sur une semaine avec 3 repas par jour et 2 collations. Pour chaque repas, spécifie:
- Nom du repas
- Liste des aliments avec quantités
- Macronutriments (protéines, glucides, lipides)
- Calories totales

Format de réponse souhaité en JSON:
{
  "daily_calories": 2000,
  "daily_macros": {
    "protein": 150,
    "carbs": 200,
    "fat": 70
  },
  "days": [
    {
      "day": "Lundi",
      "meals": [
        {
          "type": "breakfast",
          "name": "Nom du repas",
          "foods": [
            {
              "name": "Aliment",
              "quantity": "100g",
              "calories": 150
            }
          ],
          "macros": {
            "protein": 20,
            "carbs": 30,
            "fat": 10
          },
          "total_calories": 300
        }
      ]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Tu es un nutritionniste professionnel spécialisé dans la création de plans nutritionnels personnalisés."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}