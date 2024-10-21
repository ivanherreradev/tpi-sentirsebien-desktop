import React, { useEffect, useState } from 'react';
import { API } from '../../../utils/constants';
import jsPDF from 'jspdf';
import './Income.css';
import 'jspdf-autotable';
import { formatDate } from '../../../utils/formatDate';
import toast from 'react-hot-toast';
import logo from '../../../../public/spa.png';
import html2canvas from 'html2canvas';

export default function Income() {
  const [secretaryAppointments, setSecretaryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [report, setReport] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalRevenue: 0,
  });
  const [filtersApplied, setFiltersApplied] = useState(false); // Estado para controlar si se han aplicado filtros

  const generatePDF = async () => {
    handleClear();

    // Check if there are no filtered invoices
    if (filteredInvoices.length === 0) {
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

    // Determine report title based on date filters
    const reportTitle ='Informe de Ingresos';

    // Add report title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold'); // Set font to bold
    doc.text(reportTitle, marginLeft, 20 + imgHeight); // Mover hacia abajo considerando la altura del encabezado

    // Add date range and payment method
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal'); // Set font to normal
    if (startDate && endDate) {
        doc.text(`Desde: ${startDate} Hasta: ${endDate}`, marginLeft, 30 + imgHeight); // Mover hacia abajo
    } else {
        doc.text(`Historial de todos los pagos del SPA`, marginLeft, 30 + imgHeight); // Mover hacia abajo
    }
    doc.text(`Método de Pago: ${paymentMethod || 'Todos'}`, marginLeft, 40 + imgHeight); // Mover hacia abajo

    // Add total revenue at the top
    const totalRevenue = report.totalRevenue.toFixed(2);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Ingresos: $${totalRevenue}`, marginLeft, 50 + imgHeight); // Mover hacia abajo
    doc.setFont('helvetica', 'normal');

    // Add payment count based on selected payment method
    if (paymentMethod === 'Tarjeta') {
        doc.text(
            `Cantidad de Pagos: ${report.totalCardPayments !== undefined ? report.totalCardPayments : 'undefined'}`,
            marginLeft,
            60 + imgHeight // Mover hacia abajo
        );
    } else if (paymentMethod === 'Efectivo') {
        doc.text(
            `Cantidad de Pagos: ${report.totalCashPayments !== undefined ? report.totalCashPayments : 'undefined'}`,
            marginLeft,
            60 + imgHeight // Mover hacia abajo
        );
    } else {
        doc.text(
            `Cantidad de pagos con Tarjeta: ${report.totalCardPayments !== undefined ? report.totalCardPayments : 'undefined'}`,
            marginLeft,
            60 + imgHeight // Mover hacia abajo
        );
        doc.text(
            `Cantidad de pagos en Efectivo: ${report.totalCashPayments !== undefined ? report.totalCashPayments : 'undefined'}`,
            marginLeft,
            70 + imgHeight // Mover hacia abajo
        );
    }

    // Prepare payments list
    const startY = 80 + imgHeight; // Starting y position for payments list, ajustado
    doc.setFontSize(14);
    doc.text('Detalles de Pagos:', marginLeft, startY); // Mover hacia abajo

    // Loop through filteredInvoices to add each payment detail
    let currentY = startY + 10; // Initial y position for the first payment detail
    doc.setFontSize(12); // Reset font size for payment details
    filteredInvoices.forEach((invoice) => {
        const clientName = invoice.client?.name || 'Desconocido';
        const paymentMethod = invoice.paymentMethod || 'No definido';
        const paymentDate = formatDate(invoice.creationDate) || 'No definido';
        const totalAmount = `$${invoice.totalAmount.toFixed(2) || '0.00'}`;
        const paymentDetail = `${clientName} (Método: ${paymentMethod}, Fecha: ${paymentDate}, Monto: ${totalAmount})`;

        // Add payment detail to PDF
        doc.text(paymentDetail, marginLeft, currentY);
        currentY += 10; // Increase y position for next payment detail
    });

    // Save the PDF
    doc.save('informe_de_ingresos.pdf');
};


  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${API}/api/Invoices/Get`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data.$values);
      setFilteredInvoices(data.$values);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFilter = () => {
    const filtered = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.creationDate);
      const isInRange =
        (!startDate || invoiceDate >= new Date(startDate)) &&
        (!endDate || invoiceDate <= new Date(endDate));
      const isMatchingPaymentMethod =
        !paymentMethod || invoice.paymentMethod === paymentMethod;
      return isInRange && isMatchingPaymentMethod;
    });

    const totalRevenue = filtered.reduce((sum, invoice) => {
      return sum + invoice.totalAmount;
    }, 0);

    const totalCardPayments = filtered.filter(
      (invoice) => invoice.paymentMethod === 'Tarjeta'
    ).length;

    const totalCashPayments = filtered.filter(
      (invoice) => invoice.paymentMethod === 'Efectivo'
    ).length;

    setReport({
      totalRevenue,
      totalCardPayments,
      totalCashPayments,
    });

    setFiltersApplied(true);
    setFilteredInvoices(filtered);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setPaymentMethod('');
    setReport({ totalRevenue: 0 });
    setFilteredInvoices(invoices);
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

      <h2>INFORME DE INGRESOS</h2>

      {/* Filtros */}
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
            <label htmlFor='payment-method'>Tipo de Pago:</label>
            <select
              id='payment-method'
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value=''>Todos</option>
              <option value='Tarjeta'>Tarjeta</option>
              <option value='Efectivo'>Efectivo</option>
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

      {/* Informe de Ingresos */}
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

      <h3 style={{ margin: '20px 0' }}>PAGOS</h3>

      {/* Tabla de Pagos */}
      <table className='table'>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Método de Pago</th>
            <th>Fecha de Pago</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.$id}>
              <td>{invoice.client.name}</td>
              <td>{invoice.paymentMethod}</td>
              <td>{formatDate(invoice.creationDate)}</td>
              <td>${invoice.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
