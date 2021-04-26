import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Spinner, Container, Col, Navbar, Nav, Form, ListGroup, Toast, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import useFetch from './FetchData';

function Home(props) {
    const [page, setPage] = useState(1);
    const [show, setShow] = useState(false);
    const [userSelected, setUserSelected] = useState({});
    const { loading, error, userList } = useFetch(page);
    const loader = useRef(null);
    const history = useHistory();

    const handleObserver = useCallback((entries) => {
        const tgt = entries[0];
        if (tgt.isIntersecting) {
            setPage((prev) => prev + 1);
        }
    }, []);

    useEffect(() => {
        if (history.location.state !== undefined && !history.location.state.invalidUser) {
            const option = {
                root: null,
                rootMargin: '20px',
                threshold: 0
            };
            const observer = new IntersectionObserver(handleObserver, option);
            if (loader.current) {
                observer.observe(loader.current);
            }
        }
        else {
            history.push('/login');
        }
    }, [handleObserver]);

    const logoutUser = () => {
        history.push({
            pathname: '/login',
            state: { invalidUser: true }
        });

    }

    const onListItemClick = (user) => {
        setUserSelected(user);
        setShow(!show);
    }

    return (
        <Container fluid className='home-page'>
            {
                (history.location.state !== undefined && !history.location.state.invalidUser) ?
                    <div >
                        <Navbar bg="primary" variant="dark">
                            <Navbar.Brand>Infinite Responsive Scroll List</Navbar.Brand>
                            <Nav className="mr-auto">
                            </Nav>
                            <Form inline>
                                <Button variant="outline-light" type='submit' onClick={logoutUser}>Logout</Button>
                            </Form>
                        </Navbar>
                        {/* <div className='row'> */}
                        <div className='container' style={{ padding: '5px' }}>
                            {Object.keys(userSelected).length > 0 ? <Popup size="sm" userSelected={userSelected} show={show} toggle={setShow} /> : null}
                            <ListGroup>
                                {/* style={idx % 2 === 0 ? {backgroundColor: '#007bff', color: 'white'} : {}} */}
                                {userList && userList.map((user, idx) => (
                                    <ListGroup.Item key={idx} variant={idx % 2 === 0 ? 'primary' : ''} onClick={() => onListItemClick(user)}>
                                        <span style={idx % 2 === 0 ? { color: 'white' } : {}}>{user.name.title} {user.name.first} {user.name.last}</span>
                                        <img
                                            src={user.picture.large}
                                            alt='imgUrl'
                                            height='50px'
                                            width='50px'
                                            style={{ borderRadius: '50%', float: 'right' }}
                                        />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                        {/* </div> */}
                        {loading &&
                            <Spinner animation="border" variant="primary" className="spinner">
                                <span className='sr-only'>Loading...</span>
                            </Spinner>
                        }
                        {error && <p>Error!</p>}
                        <div ref={loader} />
                    </div>
                    :
                    null
            }
        </Container>
    );
}

function Toaster({ userSelected, show, toggle }) {
    return (
        <Toast show={show} onClose={() => toggle(!show)}>
            <Toast.Header>
                <img src={userSelected.picture.thumbnail} className="rounded mr-2" alt="" />
                <strong className="mr-auto">{userSelected.name.title} {userSelected.name.first} {userSelected.name.last}</strong>
                <small>Gender: {userSelected.gender}</small>
            </Toast.Header>
            <Toast.Body>
                Address:<br></br>
                Country: {userSelected.location.country}<br></br>
                City: {userSelected.location.city}<br></br>
                State: {userSelected.location.state}<br></br>
            </Toast.Body>
        </Toast>
    )
}

function Popup({ userSelected, show, toggle, ...props }) {
    return (
        <Modal
            {...props}
            show={show}
            aria-labelledby="example-modal-sizes-title-sm"
            centered
            onHide={() => toggle(!show)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <img src={userSelected.picture.thumbnail} className="rounded mr-2" alt="" />
                    <strong>{userSelected.name.title} {userSelected.name.first} {userSelected.name.last}</strong>
                    <small></small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Gender: {userSelected.gender}<br></br>
                Country: {userSelected.location.country}<br></br>
                City: {userSelected.location.city}<br></br>
                State: {userSelected.location.state}<br></br>
                Phone: {userSelected.phone}<br></br>
                Email: {userSelected.email}<br></br>
            </Modal.Body>
        </Modal>
    );
}

export default Home;
