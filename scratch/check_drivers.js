async function checkDrivers() {
  try {
    const res = await fetch('http://localhost:3000/api/drivers?where[location][exists]=true&limit=5').then(r => r.json());
    console.log('--- DRIVER LOCATION AUDIT ---');
    console.log('Total drivers with location:', res.totalDocs);
    if (res.docs.length > 0) {
      res.docs.forEach(d => {
        console.log(`Driver: ${d.name}, Full Data:`, JSON.stringify(d, null, 2));
      });
    } else {
      console.log('NO DRIVERS FOUND WITH LOCATION DATA.');
      console.log('To see markers, you must manually add coordinates to a driver in the Admin panel.');
    }
  } catch (e) {
    console.error('API Error:', e.message);
  }
}

checkDrivers();
