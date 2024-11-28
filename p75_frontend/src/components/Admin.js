import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import './css/Admin.css';

function Admin() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [pageType, setPageType] = useState('dashboard');
  const [orderId, setOrderId] = useState(1);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState('');
  const [contents, setContents] = useState([]);
  const [charts, setCharts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const history = useHistory();

  const pageTypes = ['dashboard', 'summary', 'reports'];
  const chartTypes = ['bar', 'line', 'pie'];

  const sampleChartData = {
    bar: JSON.stringify({
      chart: {
        type: 'bar',
        series: [{
          data: [65, 59, 80, 81, 56],
          name: 'AI Models Released',
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
        }],
        yScale: {
          minimum: 0,
          maximum: 100
        },
        title: 'Monthly AI Model Releases',
        colors: ['#4CAF50'],
        caption: 'This bar chart shows the number of AI models released each month, highlighting the trends over a 5-month period.'
      }
    }, null, 2),
    line: JSON.stringify({
      chart: {
        type: 'line',
        series: [{
          data: [28, 48, 40, 19, 86],
          name: 'Performance Improvements',
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        }],
        yScale: {
          minimum: 0,
          maximum: 100
        },
        title: 'AI Model Performance Trends',
        colors: ['#2196F3'],
        caption: 'This line chart illustrates the performance improvements of AI models from June to October, showcasing significant fluctuations.'
      }
    }, null, 2),
    pie: JSON.stringify({
      chart: {
        type: 'pie',
        series: [{
          data: [
            { name: 'Language Models', value: 45 },
            { name: 'Vision Models', value: 25 },
            { name: 'Multimodal Models', value: 30 }
          ]
        }],
        title: 'AI Model Types Distribution',
        colors: ['#FF9800', '#9C27B0', '#E91E63'],
        caption: 'This pie chart shows the distribution of AI models by type, with the largest portion dedicated to Language Models.'
      }
    }, null, 2)
  };

  useEffect(() => {
    fetchData();
  }, [pageType]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [contentsRes, chartsRes] = await Promise.all([
        axios.get(`http://localhost:8000/admin/contents/${pageType}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8000/admin/charts/${pageType}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setContents(contentsRes.data);
      setCharts(chartsRes.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmitContent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Not authorized. Please login again.');
      history.push('/login');
      return;
    }

    const contentState = convertToRaw(editorState.getCurrentContent());
    const content = JSON.stringify(contentState);
    
    try {
      const endpoint = editMode === 'content' ? 
        `http://localhost:8000/admin/content/${editId}` : 
        'http://localhost:8000/admin/add_content';

      const method = editMode === 'content' ? 'PUT' : 'POST';

      const data = {
        page_type: pageType,
        content,
        order_id: orderId
      };

      await axios({
        method,
        url: endpoint,
        data,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(`Content ${editMode === 'content' ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmitChart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Not authorized. Please login again.');
      history.push('/login');
      return;
    }
    
    try {
      const endpoint = editMode === 'chart' ? 
        `http://localhost:8000/admin/chart/${editId}` : 
        'http://localhost:8000/admin/add_chart';

      const method = editMode === 'chart' ? 'PUT' : 'POST';

      const data = {
        page_type: pageType,
        chart_type: chartType,
        chart_data: JSON.parse(chartData),
        order_id: orderId
      };

      await axios({
        method,
        url: endpoint,
        data,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(`Chart ${editMode === 'chart' ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted successfully!');
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditContent = (item) => {
    setEditMode('content');
    setEditId(item.id);
    setPageType(item.page_type);
    setOrderId(item.order_id);
    
    const blocksFromHTML = convertFromHTML(item.html_content);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  };

  const handleEditChart = (item) => {
    setEditMode('chart');
    setEditId(item.id);
    setPageType(item.page_type);
    setOrderId(item.order_id);
    setChartType(item.chart_type);
    console.log(item.chart_data);
    setChartData(item.chart_data);
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setEditorState(EditorState.createEmpty());
    setChartData('');
    setOrderId(1);
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      history.push('/login');
    } else {
      toast.error('Operation failed.');
      console.error('Error:', error);
    }
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
    setChartData(sampleChartData[e.target.value]);
  };

  return (
    <div className="admin-container">
      <h2>Content Management</h2>
      <form onSubmit={handleSubmitContent}>
        <div className="form-group">
          <label htmlFor="pageType">Page Type:</label>
          <select 
            id="pageType" 
            value={pageType} 
            onChange={(e) => setPageType(e.target.value)}
          >
            {pageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="orderId">Order ID:</label>
          <input
            type="number"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(parseInt(e.target.value))}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <Editor
            editorState={editorState}
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            toolbarClassName="toolbar"
            onEditorStateChange={setEditorState}
          />
        </div>

        <button type="submit" className="submit-button">
          {editMode === 'content' ? 'Update' : 'Add'} Content
        </button>
        {editMode === 'content' && (
          <button type="button" onClick={resetForm} className="cancel-button">
            Cancel
          </button>
        )}
      </form>

      {pageType !== 'dashboard' && (
        <form onSubmit={handleSubmitChart}>
          <div className="form-group">
            <label htmlFor="chartType">Chart Type:</label>
            <select 
              id="chartType" 
              value={chartType} 
              onChange={handleChartTypeChange}
            >
              {chartTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chartData">Chart Data (JSON):</label>
            <textarea
              id="chartData"
              value={chartData}
              onChange={(e) => setChartData(e.target.value)}
              rows="10"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {editMode === 'chart' ? 'Update' : 'Add'} Chart
          </button>
          {editMode === 'chart' && (
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </form>
      )}

      <div className="data-tables">
        <h3>Existing Content</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Page Type</th>
              <th>Order ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.page_type}</td>
                <td>{item.order_id}</td>
                <td>
                  <button onClick={() => handleEditContent(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id, 'content')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageType !== 'dashboard' && (
          <>
            <h3>Existing Charts</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Page Type</th>
                  <th>Chart Type</th>
                  <th>Order ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {charts.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.page_type}</td>
                    <td>{item.chart_type}</td>
                    <td>{item.order_id}</td>
                    <td>
                      <button onClick={() => handleEditChart(item)}>Edit</button>
                      <button onClick={() => handleDelete(item.id, 'chart')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;