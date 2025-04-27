import { useState } from 'react';
import { Calculator, BookOpen, Zap, RefreshCw, UserCheck, Github, Linkedin } from 'lucide-react';
import jdImage from '../assets/team/jd.jpg';
import anandImage from '../assets/team/anand.jpg';
import arunawImage from '../assets/team/arunaw.jpg';

const About = () => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleCardFlip = (index: number) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const developers = [
    {
      name: "Joe Daniel A",
      role: "Frontend Developer",
      image: jdImage,
      github: "https://github.com/joedanields",
      linkedin: "https://www.linkedin.com/in/joe-daniel1911"
    },
    {
      name: "Anand P",
      role: "Backend Engineer",
      image: anandImage,
      github: "https://github.com/michaeljohnson",
      linkedin: "https://linkedin.com/in/michaeljohnson"
    },
    {
      name: "Arunaw Rishe M",
      role: "UI/UX Designer",
      image: arunawImage,
      github: "https://github.com/ARUNAWRISHE",
      linkedin: "https://www.linkedin.com/in/arunaw-rishe-m-74a698352/"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About MathSolver
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A free math problem-solving platform for students by PHC
        </p>
      </header>

      {/* Developer Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Problem Hunters Community
        </h2>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="relative h-96 cursor-pointer" onClick={() => toggleCardFlip(index)}>
              {/* Front of Card */}
              <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${flippedCards.includes(index) ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center justify-center p-4`}>
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <img 
                    src={dev.image} 
                    alt={dev.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{dev.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{dev.role}</p>
                <p className="text-sm text-blue-500 mt-4">Click to see contact info</p>
              </div>

              {/* Back of Card */}
              <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${flippedCards.includes(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md flex flex-col items-center justify-center p-6`}>
                <h3 className="font-bold text-xl text-white mb-8">{dev.name}</h3>
                <p className="text-white mb-8">Connect with me:</p>
                <div className="flex space-x-4">
                  <a 
                    href={dev.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-gray-900 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={24} />
                  </a>
                  <a 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-blue-600 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin size={24} />
                  </a>
                </div>
                <p className="text-sm text-white mt-6">Click to flip back</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          MathSolver was created with a simple mission: to make mathematics accessible, understandable, 
          and free for all students. We believe that every student should have access to powerful math tools 
          regardless of their financial situation or location.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Our platform provides immediate solutions to a wide range of mathematical problems, 
          from basic arithmetic to advanced calculus, with step-by-step explanations that help students 
          understand the underlying concepts and improve their problem-solving skills.
        </p>
      </section>

      {/* Core Principles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-2 rounded-lg mr-3">
                <Calculator size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Accessibility</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Free for everyone, no paywalls, no subscriptions, no limits.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-lg mr-3">
                <BookOpen size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              We emphasize learning by showing steps and explanations, not just answers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 p-2 rounded-lg mr-3">
                <UserCheck size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Privacy</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              No account required, no data collection, and no tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-2 rounded-lg mr-3">
                <RefreshCw size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Continuous Improvement</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              We're constantly adding new tools and enhancing existing ones.
            </p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use MathSolver
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            <li><span className="font-medium">Choose a calculator</span> from our homepage that matches your problem type.</li>
            <li><span className="font-medium">Enter your problem</span> using our intuitive input fields.</li>
            <li><span className="font-medium">Click "Solve"</span> to get your answer and see step-by-step explanations.</li>
            <li><span className="font-medium">Download or share</span> your results if needed.</li>
            <li><span className="font-medium">Use the examples</span> provided if you're not sure how to format your input.</li>
          </ol>
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Feedback and Suggestions
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We're always looking to improve MathSolver and add new features that help students. 
          If you have suggestions, feedback, or encounter any issues, please reach out through our feedback form.
        </p>
        <div className="flex justify-center">
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSezTr8PciI7JoPXJG8ekADe8uEpDNyqI-s-SS1OD8m8jQz5_g/viewform?usp=sharing" 
            className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Zap size={18} className="mr-2" />
            Send Feedback
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
