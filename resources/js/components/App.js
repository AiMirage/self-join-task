import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Alert, Jumbotron} from 'react-bootstrap';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            baseUrl: "http://127.0.0.1:8000/",
            error: null,
            message: null,
            isLoaded: false,
            items: [],
            parent: {}
        };
    }

    componentDidMount() {
        let url = this.state.baseUrl.concat("0");
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let parent = result.reverse().pop();
                    this.setState({
                        isLoaded: true,
                        items: result,
                        parent: parent
                    });
                    console.log(result);
                    console.log(parent);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    fetchSub = (id) => {
        const baseUrl = 'http://127.0.0.1:8000/';

        let parent = this.state.items.find((item) => parseInt(id) === item.id);
        this.setState({
            parent: parent
        });
        // console.log(id);
        // console.log(parent);
        let url = baseUrl.concat(id);
        console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                    // console.log(result)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    };

    saveCategory = (category) => {
        console.log(category);
        let url = this.state.baseUrl.concat("api/category");
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        message: result.message
                    });
                    // setTimeout(() => location.reload() , 2000);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const {error, message, isLoaded, items, parent} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Jumbotron>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        let categoryName = e.target[0].value;
                        let parentId = e.target[1].value;
                        let newCategory = {
                            name: categoryName,
                            parent_id: parentId
                        };
                        this.saveCategory(newCategory);
                    }}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Category Name: </Form.Label>
                            <Form.Control type="text" placeholder="Enter Category" required/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Parent</Form.Label>
                            <Form.Control as="select" onChange={(e) => this.fetchSub(e.target.value)}>
                                <option value={parent.id}>{parent.name}</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}> - {item.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" className="m"> Add </Button>
                    </Form>

                    {
                        message ? <Alert variant="success"> {message} </Alert> : ""
                    }

                </Jumbotron>
            );
        }
    }
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(< App/>, document.getElementById('app')
    )
}
