import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <section id="contact-form" className="contact">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <textarea 
          placeholder="Description" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>Email: info@paynder.com</p>
      <p>Phone: +254795414186</p>
    </section>
  );
};

export default Contact;
