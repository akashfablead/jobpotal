import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Job Hunt?",
      answer: "Job Hunt is a platform that connects job seekers with top employers, helping you find your dream job."
    },
    {
      question: "How do I apply for a job?",
      answer: "You can browse jobs on our platform and click on the 'Apply' button for the job you are interested in."
    },
    {
      question: "Is there a fee to use Job Hunt?",
      answer: "No, Job Hunt is completely free for job seekers."
    },
    {
      question: "How can employers post a job?",
      answer: "Employers can create an account and navigate to the 'Post a Job' section to submit their job listings."
    },
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password?' link on the login page."
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h2 className="font-semibold text-lg">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;