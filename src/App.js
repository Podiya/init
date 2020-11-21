import './App.css';
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";
import {
  Container, Card, CardBody, CardTitle, CardSubtitle, CardText, Row, Col, Button
} from 'reactstrap';

export default function App() {
  const [devices, setDevices] = useState([]);
  const history = useHistory();

  async function fetchDevices() {
    const res = await fetch('https://us-central1-mihcmloggin.cloudfunctions.net/devicelist');
    res.json()
      .then(res => {
        setDevices(res)
      })
  }

  useEffect(() => {
    fetchDevices();
  }, [])

  function onSelectDevice(value) {
    history.push(`/logs/${value}`);
  }

  return (

    <Container className="container">
      <Row>
        <Col xs="12">
          <h2>Devices</h2>
        </Col>
      </Row>
      <Row>
        <Col xs="auto">
          <select defaultValue={'default'} onChange={(e) => onSelectDevice(e.target.value)}>
            <option value={'default'} key={'default'}>Select device</option>
            {devices.map(item => {
              return (
                <option value={item} key={item}>{item}</option>
              );
            })}
          </select>
        </Col>
        <Col xs="auto"><Button onClick={fetchDevices} color="warning" size="sm">Refresh Device List</Button>{' '}</Col>
      </Row>

      <Switch>
        <Route path={`/logs/:deviceId`}>
          <Logs />
        </Route>
      </Switch>
    </Container>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Logs() {
  let { deviceId } = useParams();
  const [logs, setLogs] = useState([])

  async function fetchLogs() {
    const res = await fetch(`https://us-central1-mihcmloggin.cloudfunctions.net/logs?device=${deviceId}`);
    res.json()
      .then(res => {
        setLogs(res)
      })
  }

  async function deleteLogs() {
    const res = await fetch(`https://us-central1-mihcmloggin.cloudfunctions.net/drop?device=${deviceId}`);
    res.json()
      .then(res => {
        setLogs([]);
      })
  }

  // useEffect(() => {
  //   fetchLogs();
  // }, [])

  useEffect(() => {
    fetchLogs();
  }, [deviceId])


  return (
    <>
      <Row>
        <Col xs="9">
          <h4>Requested device: {deviceId}</h4>
        </Col>
        <Col xs="1"><Button onClick={fetchLogs} color="warning" size="sm">Refresh</Button>{' '}</Col>
        <Col xs="2"><Button onClick={deleteLogs} color="danger" size="sm">Delete Logs</Button>{' '}</Col>
      </Row>
      <Row>
        {
          logs.map(log => {
            return (
              <Col key={log.milliseconds} xs="12">
                <Card>
                  <CardBody>
                    <CardTitle tag="h6">{log.url}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">{log.status}</CardSubtitle>
                    <CardText>{JSON.stringify(log.response)}</CardText>
                  </CardBody>
                </Card>
              </Col>
            );
          })
        }
      </Row>
    </>
  );
}

