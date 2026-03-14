const url = "https://jwojnxopkuqmmwpomfss.supabase.co/rest/v1/fighters?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3b2pueG9wa3VxbW13cG9tZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Mjc0MzAsImV4cCI6MjA4NzIwMzQzMH0.but9kEhaezBRcnh5NFnRBqluClB30zjIctxw_0Ly2LQ";

fetch(url, {
  headers: {
    "apikey": key,
    "Authorization": "Bearer " + key
  }
}).then(r => r.json()).then(data => {
  const tauan = data.find(f => f.name.toLowerCase().includes('tauan'));
  console.log("ALL DATA LENGTH:", data.length);
  console.log("TAUUAN DATA:", tauan);
}).catch(console.error);
