async function updateDriver() {
  try {
    const driverId = '69eb08a9936ac8c795cf95f1';
    const response = await fetch(`http://localhost:3000/api/drivers/${driverId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: [80.2707, 13.0827],
      }),
    });
    
    const data = await response.json();
    console.log('--- UPDATE RESULT ---');
    console.log('Status Code:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Update Error:', e.message);
  }
}

updateDriver();
