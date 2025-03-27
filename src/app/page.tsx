"use client"
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {
  const [vehicles, setVehicle] = useState([]);
  const [form, setForm] = useState({ license_plate: '', size: '' });

  type Vehicle = {
    _id: string,
    license_plate: string,
    size: string
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    setVehicle(data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      fetchItems();
      setForm({ license_plate: '', size: '' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="license_plate"
          placeholder="License Plate"
          value={form.license_plate}
          onChange={handleChange}
        />
        <input
          name="size"
          placeholder="Vehicle Size"
          value={form.size}
          onChange={handleChange}
        />
        <button type="submit">Add Vehicle</button>
      </form>

      <ul>
        {vehicles.map((vehicle: Vehicle) => (
          <li key={vehicle._id}>
            {vehicle.size} - {vehicle.license_plate}
          </li>
        ))}
      </ul>
    </div>
  );
}