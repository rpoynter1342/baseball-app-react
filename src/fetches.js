async function mainFetch() {
    // main_home needs: teams, standings, news
    try {
      const response = await fetch('http://127.0.0.1:4444/main_home');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchRoster() {
    // main_home needs: teams, standings, news
    try {
        const response = await fetch(`http://127.0.0.1:4444/roster?key=${key}`);
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
  }