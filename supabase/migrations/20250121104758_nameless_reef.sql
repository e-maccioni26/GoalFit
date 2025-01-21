/*
  # Initial Schema Setup for GoalFit

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `current_weight` (numeric)
      - `target_weight` (numeric)
      - `height` (numeric)
      - `birth_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weight_logs`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `weight` (numeric)
      - `date` (date)
      - `created_at` (timestamp)

    - `workouts`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `name` (text)
      - `date` (date)
      - `completed` (boolean)
      - `created_at` (timestamp)

    - `exercises`
      - `id` (uuid, primary key)
      - `workout_id` (uuid, references workouts)
      - `name` (text)
      - `sets` (integer)
      - `reps` (integer)
      - `duration` (interval)
      - `completed` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  current_weight numeric,
  target_weight numeric,
  height numeric,
  birth_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weight_logs table
CREATE TABLE weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  weight numeric NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sets integer,
  reps integer,
  duration interval,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own weight logs"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own workouts"
  ON workouts FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can view exercises for own workouts"
  ON exercises FOR SELECT
  TO authenticated
  USING (workout_id IN (
    SELECT id FROM workouts WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Users can manage exercises for own workouts"
  ON exercises FOR ALL
  TO authenticated
  USING (workout_id IN (
    SELECT id FROM workouts WHERE profile_id = auth.uid()
  ));