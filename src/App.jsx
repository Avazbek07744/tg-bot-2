import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [cards, setCards] = useState([]);

  useEffect(()=>{
    if (localStorage.getItem('card')) {
      let local = JSON.parse(localStorage.getItem('card')|| '[]')
      setCards(local)
    }
  },[])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCards = [...cards, formData];
    setCards(updatedCards);
    localStorage.setItem('card', JSON.stringify(updatedCards));
    setFormData({ name: '', description: '' });
  };


  useEffect(() => {
    const interval = setInterval(() => {
      cards.forEach(sendToTelegram);
    }, 10000);
    return () => clearInterval(interval);
  }, [cards]);

  const sendToTelegram = (data) => {
    const token = '8031185324:AAGmZD4h_gdCsIlEmDMmTkDCHAffryzQ6jo';
    const chatId = '@eslatmalr';
    axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: `${data.name} \n${data.description}`,
    })
    .then(response => {
      console.log('Xabar yuborildi:', response.data);
    })
    .catch(error => {
      console.error('Xato:', error.response.data);
    });
    
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4 w-96 mx-auto mt-20">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border-2 shadow-md h-14 rounded-md font-semibold text-lg shadow-white text-white resize-none placeholder:text-white outline-none bg-transparent p-2 w-full mb-6"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border-2 shadow-md h-32 rounded-md font-semibold text-lg shadow-white text-white resize-none placeholder:text-white outline-none bg-transparent p-2 w-full mb-2"
        />
        <button type="submit" className="bg-transparent text-white px-4 py-2 border w-full text-2xl font-bold rounded-md shadow-md hover:shadow-white">Submit</button>
      </form>
      <div className='flex gap-5 flex-wrap items-center'>
        {cards.map((card, index) => (
          <div key={index} className="border p-4 mb-2 w-64 text-white rounded-md">
            <h2 className="font-bold">{card.name}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;