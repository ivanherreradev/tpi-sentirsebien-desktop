import React, { useEffect, useState } from 'react';
import { API } from '../../../utils/constants';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '../../../utils/formatDate';
import toast from 'react-hot-toast';
import logo from '../../../../public/spa.png';
import html2canvas from 'html2canvas';

export default function ProfessionalServices() {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [report, setReport] = useState({
    totalRevenue: 0,
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  const generatePDF = async () => {
    handleClear();

    // Check if filters are in default state
    if (!startDate && !endDate && !selectedEmployee) {
      toast.error('No se puede generar informe sin filtros.', 'Error'); // Display error toast
      return; // Stop the function execution
    }

    // Check if there are no filtered services
    if (filteredServices.length === 0) {
      toast.error('No hay datos disponibles para generar el informe.', 'Error'); // Display error toast
      return; // Stop the function execution
    }

    const doc = new jsPDF();

    // Capturar el contenedor usando html2canvas
    const pdfHeader = document.getElementById('pdf-header');

    // Definición de variables
    const imgHeight = 60; // Altura de la imagen
    const imgWidth = 80; // Ancho de la imagen
    const marginTop = 10; // Margen superior en el PDF
    const marginLeft = 10;
    const lineHeight = 10;

    try {
      const canvas = await html2canvas(pdfHeader, {
        useCORS: true, // Enable CORS
        allowTaint: true, // Allow tainted images
        scale: 1, // Adjust scale to prevent zoom
      });
      const imgData = canvas.toDataURL('image/png');

      const pageHeight = doc.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Añadir la imagen capturada al PDF, centrada
      const imgX = (doc.internal.pageSize.width - imgWidth) / 2; // Calcular la posición X para centrar
      doc.addImage(imgData, 'PNG', imgX, marginTop, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Si la imagen es más alta que la página, agrega una nueva página
      while (heightLeft >= 0) {
        doc.addPage();
        doc.addImage(
          imgData,
          'PNG',
          imgX,
          heightLeft - imgHeight,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }
    } catch (error) {
      console.error('Error capturing the header for PDF:', error);
      toast.error('Error al capturar el encabezado del informe.', 'Error'); // Display error toast
      return; // Stop the function execution if capturing fails
    }

    // Agregar título del informe centrado
    const reportTitleText = 'Informe de Servicios';
    const reportTitleY = imgHeight + marginTop + 10; // Posición del título debajo de la imagen
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    // Cambiar la posición X para alinear a la izquierda
    doc.text(reportTitleText, marginLeft, reportTitleY);

    // Mantener el resto del contenido sin cambios
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal'); // Set font to normal
    const dateText =
      startDate && endDate
        ? `Desde: ${startDate} Hasta: ${endDate}`
        : 'Historial de todos los servicios';
    doc.text(dateText, 10, reportTitleY + 10); // Mantener alineación a la izquierda
    doc.text(
      `Empleado Asignado: ${selectedEmployee || 'Todos'}`,
      10,
      reportTitleY + 20 // Mantener alineación a la izquierda
    );

    // Total ingresos alineado a la izquierda
    const totalRevenue = report.totalRevenue.toFixed(2);
    doc.text(`Total Ingresos: $${totalRevenue}`, 10, reportTitleY + 30); // Mantener alineación a la izquierda

    // Prepare services list
    const startY = reportTitleY + 50; // Starting y position for services list
    doc.setFontSize(14);
    doc.text('Detalles de Servicios:', marginLeft, startY);

    // Loop through filteredServices to add each service detail
    let currentY = startY + lineHeight; // Initial y position for the first service detail
    doc.setFontSize(12); // Reset font size for service details
    filteredServices.forEach((service) => {
      const clientName = service.clientName || 'Desconocido';
      const serviceName = service.serviceDetail.name || 'No definido';
      const serviceDate = formatDate(service.startDate) || 'No definido';
      const employeeName = service.employeeName || 'No definido';
      const totalAmount = `$${
        service.serviceDetail.price.toFixed(2) || '0.00'
      }`;

      const serviceDetail = `- ${clientName} (Servicio: ${serviceName}, Fecha: ${serviceDate}, Empleado: ${employeeName}, Monto: ${totalAmount})`;

      // Use splitTextToSize to wrap the service detail text
      const textLines = doc.splitTextToSize(serviceDetail, 180); // 180 is the max width
      textLines.forEach((line) => {
        doc.text(line, marginLeft, currentY);
        currentY += lineHeight; // Increase y position for next line
      });

      // Check if currentY exceeds page height and add a new page if necessary
      if (currentY > doc.internal.pageSize.height - marginTop) {
        doc.addPage();
        currentY = marginTop; // Reset Y position to the top
      }
    });

    // Save the PDF
    doc.save('informe_de_servicios.pdf');
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API}/api/Reservation/GetActivePaid`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.$values);
      setFilteredServices(data.$values);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await fetch(`${API}/api/Employee/GetProfessionals`);
      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }
      const data = await response.json();
      setProfessionals(data.$values);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchProfessionals();
  }, []);

  const handleFilter = () => {
    const filtered = services.filter((service) => {
      const serviceDate = new Date(service.startDate);
      const isInRange =
        (!startDate || serviceDate >= new Date(startDate)) &&
        (!endDate || serviceDate <= new Date(endDate));

      const isMatchingEmployee =
        !selectedEmployee || service.employeeName === selectedEmployee; // Compare by full name

      return isInRange && isMatchingEmployee;
    });

    const totalRevenue = filtered.reduce((sum, service) => {
      return sum + service.serviceDetail.price;
    }, 0);

    setReport({
      totalRevenue,
    });

    setFiltersApplied(true);
    setFilteredServices(filtered);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setSelectedEmployee('');
    setReport({ totalRevenue: 0 });
    setFilteredServices(services);
    setFiltersApplied(false);
  };

  return (
    <div className='container'>
      {/* Contenedor oculto para html2canvas */}
      <div
        id='pdf-header'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <img src={logo} alt='Logo' style={{ width: '80px', height: '80px' }} />
        <h1 style={{ margin: 0 }}>SPA SENTIRSE BIEN</h1>
      </div>

      <h2>INFORME DE SERVICIOS REALIZADOS</h2>

      <div className='filters'>
        <div>
          <div className='input-group'>
            <label htmlFor='start-date'>Desde:</label>
            <input
              type='date'
              id='start-date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <label htmlFor='end-date'>Hasta:</label>
            <input
              type='date'
              id='end-date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <label htmlFor='employee'>Empleado Asignado:</label>
            <select
              id='employee'
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value=''>Todos</option>
              {professionals.map((professional) => (
                <option
                  key={professional.id}
                  value={`${professional.name} ${professional.lastName}`}
                >
                  {`${professional.name} ${professional.lastName}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={handleFilter}
            className='btn-success'
            style={{ marginRight: '10px' }}
          >
            Filtrar
          </button>
          <button onClick={handleClear} className='btn-link'>
            Limpiar
          </button>
        </div>
      </div>

      <div className='report'>
        <p>
          Total Ingresos: <strong>${report.totalRevenue.toFixed(2)}</strong>
        </p>

        <button
          onClick={generatePDF}
          className='btn-info'
          disabled={!filtersApplied}
        >
          Imprimir Informe
        </button>
      </div>

      <h3 style={{ margin: '20px 0' }}>SERVICIOS REALIZADOS</h3>

      <table className='table'>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Empleado Asignado</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.$id}>
              <td>{service.clientName}</td>
              <td>{service.clientEmail}</td>
              <td>{service.serviceDetail.name}</td>
              <td>{formatDate(service.startDate)}</td>
              <td>{service.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
