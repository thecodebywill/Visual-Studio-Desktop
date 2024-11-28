import React, { useState } from 'react';
const Contact: React.FC = () => {
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
    <section id="contact" className="contact">
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
      <div className="contact-links">
        <a href="mailto:info@paynder.com" className="contact-item">
          <i className="far fa-envelope"></i>
          info@paynder.com
        </a>
        <a href="tel:+254795414186" className="contact-item">
          <i className="fas fa-phone"></i>
          +254 795 414 186
        </a>
      </div>
    </section>
  );
};
export default Contact;
