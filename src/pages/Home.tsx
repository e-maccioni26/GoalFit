import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Target, Utensils, Users, TrendingUp, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight mb-8">
              Transformez votre vie avec GoalFit
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Votre coach personnel pour atteindre vos objectifs de remise en forme. 
              Programmes personnalisés, suivi nutritionnel et accompagnement sur mesure.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Commencer Gratuitement
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Tout ce dont vous avez besoin pour réussir
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-purple-600" />}
              title="Programmes Personnalisés"
              description="Des programmes d'entraînement adaptés à vos objectifs et votre niveau"
            />
            <FeatureCard
              icon={<Utensils className="w-8 h-8 text-purple-600" />}
              title="Plans Nutritionnels"
              description="Des conseils nutritionnels et des plans de repas équilibrés"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
              title="Suivi de Progression"
              description="Suivez vos progrès et visualisez vos résultats en temps réel"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Ils ont atteint leurs objectifs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              name="Sophie Martin"
              text="Grâce à GoalFit, j'ai perdu 15kg en 6 mois. Les programmes personnalisés ont fait toute la différence !"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              name="Thomas Dubois"
              text="L'application est intuitive et les conseils nutritionnels sont excellents. Je me sens en pleine forme !"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              name="Marie Lambert"
              text="Le suivi personnalisé m'a permis de rester motivée. Je recommande à 100% !"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Prêt à commencer votre transformation ?
          </h2>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Rejoignez GoalFit Maintenant
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ image, name, text }) => (
  <div className="bg-gray-50 p-8 rounded-xl">
    <img
      src={image}
      alt={name}
      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
    />
    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{name}</h3>
    <p className="text-gray-600 text-center italic">{text}</p>
  </div>
);

export default Home;