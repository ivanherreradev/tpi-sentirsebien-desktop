export const formatDate = (dateString) => {
  const date = new Date(dateString); // Convierte la cadena a un objeto Date
  const day = String(date.getDate()).padStart(2, '0'); // Día
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (de 0 a 11, así que se suma 1)
  const year = date.getFullYear(); // Año

  const hours = String(date.getHours()).padStart(2, '0'); // Hora
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos

  return `${day}/${month}/${year} a las ${hours}:${minutes}`;
};
