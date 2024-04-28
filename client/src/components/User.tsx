import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { MdEdit, MdDelete } from "react-icons/md";
import { IUser } from '../User';

const User: React.FC = () => {
  const [items, setItems] = useState<IUser[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [updateId, setUpdateId] = useState<string | null>(null);
  
  const URL: string = "http://localhost:3000/users";
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get<IUser[]>(URL);
    console.log(response.data)
    setItems(response.data);
  };

  const addItem = async () => {
    await axios.post(URL, { fullName, email });
    fetchItems();
    setFullName('');
    setEmail('');
  };

  const deleteItem = async (id: string) => {
    await axios.delete(`${URL}/${id}`);
    fetchItems();
  };

  const updateItem = async () => {
    if (!updateId) return;

    await axios.patch(`${URL}/${updateId}`, {
      fullName,
      email,
    });
    fetchItems();
    setFullName('');
    setEmail('');
    setUpdateId(null);
  };

  const handleUpdateClick = (id: string, itemName: string, itemDescription: string) => {
    setUpdateId(id);
    setFullName(itemName);
    setEmail(itemDescription);
  };

  return (
     <div className="container">
      <h1>CRUD APP</h1>
      <div className="form">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        {updateId ? (
          <button onClick={updateItem}>Update</button>
        ) : (
          <button onClick={addItem}>Add</button>
        )}
      </div>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            <div className="item-details">
              <div className="item-name">{item.fullName}</div>
              <div className="item-description">{item.email}</div>
            </div>
            <div className="button-group">
              <button onClick={() => handleUpdateClick(item.id, item.fullName, item.email)}>
                <MdEdit />
              </button> 
              <button onClick={() => deleteItem(item.id)}><MdDelete/></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
