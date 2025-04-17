"use client"
import React from "react";
import { useState } from 'react';
import { useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@heroui/react";
import { ParkingManager } from "../lib/parkingmanager"
import {
  ParkingSpot,
  Level,
  VehicleSize
} from "../lib";

export default function Home() {
  const [page, setPage] = useState(1);
  const [vehicles, setVehicle] = useState([]);
  const [parking, setParking] = useState([]);
  const [allSpots, setAllSpots] = useState([]);

  const [form, setForm] = useState({ license_plate: '', size: '' });
  const [park, setPark] = useState({ license_plate: '', parking_spot: '' })

  useEffect(() => {
    fetchItems();
  }, []);

  const SpotPerLevel = 10;
  const Levels = 4

  const fetchItems = async () => {
    let res1 = await fetch('/api/vehicles');
    let data1 = await res1.json();
    setVehicle(data1.data);
    let res2 = await fetch('/api/parkingspots');
    let data2 = await res2.json();
    setParking(data2.data);
    const parked = data2.data;

    const manager = new ParkingManager(Levels, SpotPerLevel); // levels, spots per level
    const generatedSpots = ParkingManager.getAllSpots();

    const merged = generatedSpots.map((spot) => {
      const match = parked.find((p) => p.parking_spot === spot.spot_id);
      return {
        spot_id: spot.spot_id,
        size: spot.size,
        license_plate: match?.license_plate || '',
        status: match ? 'Occupied' : 'Available',
      };
    });

    setAllSpots(merged);
  };

  
  const paginatedSpots = allSpots.slice(
    (page - 1) * SpotPerLevel,
    page * SpotPerLevel
  );

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

  const handleChangePark = (e) => {
    setPark({ ...park, [e.target.name]: e.target.value });
  };

  const handlePark = async (e) => {
    e.preventDefault();
    try {
      const license_plate = park.license_plate; // from your form state
      const parking_spot = park.parking_spot;
      const licensePlates = vehicles.map((vehicle) => vehicle.license_plate);
      if (!licensePlates.includes(park.license_plate)) {
        alert("This vehicle is not in the database.");
        return;
      }

      const spot = ParkingManager.getASpot(parking_spot);
      if (!spot) {
        console.error("Spot not found in ParkingManager");
        return;
      }

      const size = spot.size;

      const res = await fetch('/api/parkingspots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({license_plate, size: String(size), parking_spot}),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Vehicle parked successfully!');
      } else if (res.status == 400) {
        alert(data.message || 'Invalid request. Check vehicle size or spot.');
      } else if (res.status == 404) {
        alert(data.message || 'Vehicle or spot not found.');
      } else {
        alert('An unexpected error occurred.');
      }

      fetchItems();
      setPark({ license_plate: '', parking_spot: '' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Banana Parking Lot</h1>
      <div className="form_center">
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
      </div>

      <br></br>

      <div className="form_center">
        <form onSubmit={handlePark}>
          <input
            name="license_plate"
            placeholder="License Plate"
            value={park.license_plate}
            onChange={handleChangePark}
          />
          <input
            name="parking_spot"
            placeholder="Parking Spot (L01S01)"
            value={park.parking_spot}
            onChange={handleChangePark}
          />
          <button type="submit">Park Vehicle</button>
        </form>

      <br/>

      </div>
      <Table
        aria-label="All Vehicles"
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="license">License</TableColumn>
          <TableColumn key="size">Size</TableColumn>
          <TableColumn key="status">Status</TableColumn>
        </TableHeader>
        <TableBody items={vehicles}>
          {(item) => (
            <TableRow key={item._id}>
              <TableCell className="text-center">{item.license_plate}</TableCell>
              <TableCell className="text-center">{item.size}</TableCell>
              <TableCell className="text-center">
                {parking.map((parking_vec) => parking_vec.license_plate).includes(item.license_plate)
                  ? "Parked"
                  : "Not Parked"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <br></br>

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Table
            aria-label="Parking Spots"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={Levels}
                  onChange={(page) => setPage(page)}
                  classNames={{
                    wrapper: "flex gap-2 justify-center",
                    item: "px-3 py-1 rounded-md border text-sm",
                    cursor: "bg-secondary text-white",
                    prev: "px-2 text-sm",
                    next: "px-2 text-sm"
                  }}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn key="spot_id">Spot ID</TableColumn>
              <TableColumn key="size">Size</TableColumn>
              <TableColumn key="license_plate">License Plate</TableColumn>
              <TableColumn key="status">Status</TableColumn>
            </TableHeader>
            <TableBody items={paginatedSpots}>
              {(item) => (
                <TableRow key={item.spot_id}>
                  <TableCell className="text-center">{item.spot_id}</TableCell>
                  <TableCell className="text-center">{item.size}</TableCell>
                  <TableCell className="text-center">{item.license_plate || '-'}</TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}