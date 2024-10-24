import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Measurement {
  id: number;
  height: number;
  weight: number;
  timestamp: string;
}

interface MeasurementHistoryProps {
  studentId: number;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ studentId }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/measurements/?student=${studentId}`);
        setMeasurements(response.data);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };

    fetchMeasurements();
  }, [studentId]);

  return (
    <div>
      <h3>Measurement History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Height (cm)</th>
            <th>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={measurement.id}>
              <td>{new Date(measurement.timestamp).toLocaleDateString()}</td>
              <td>{measurement.height}</td>
              <td>{measurement.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementHistory;
