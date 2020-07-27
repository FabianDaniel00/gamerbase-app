import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import "./Form.scss";

const ADD_CATEGORY = gql`
  mutation ($name: String!) {
    createCategory(category: { name: $name }) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation ($id: ID!, $name: String!) {
    updateCategory(category:{name: $name}, id: $id) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation ($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const DevInterface = () => {
  let name;
  let id;
  const [createCategory] = useMutation(ADD_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [ IDRequired, setIDRequired ] = useState(Boolean);
  const [ nameRequired, setNameRequired ] = useState(Boolean);
  const [ submitEvent, setSubmitEvent ] = useState("");

  function handleSubmit() {
    if (submitEvent === "add") {
      setNameRequired(true);
      setIDRequired(false);
      createCategory({ variables: { name: name.value } });
      name.value = "";
      id.value = "";
    } else if (submitEvent === "update") {
      setIDRequired(true);
      setIDRequired(true);
      updateCategory({variables: { id: id.value, name: name.value } });
      name.value = "";
      id.value = "";
    } else if (submitEvent === "delete") {
      setNameRequired(false);
      setIDRequired(true);
      deleteCategory({ variables: { id: id.value } });
      name.value = "";
      id.value = "";
    }
  }

  return (
    <Form
      className="form-wrapper"
      onSubmit={(event) => handleSubmit(event.preventDefault())}
    >
      <div className="title-div">
        <Form.Label className="title">Category</Form.Label>
      </div>

      <Form.Group controlId="formHorizontalCategoryName">
        <Form.Label column>Category name</Form.Label>
        <Col>
          <Form.Control
            type="text"
            placeholder="category name"
            ref={(node) => {
              name = node;
            }}
            required={nameRequired}
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalCategoryID">
        <Form.Label column>Category ID</Form.Label>
        <Col>
          <Form.Control
            type="number"
            placeholder="category id"
            ref={(node) => {
              id = node;
            }}
            required={IDRequired}
          />
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          <Button
            onClick={() => setSubmitEvent("add")}
            type="submit"
            block
          >
            Add category
          </Button>
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          <Button
            onClick={() => setSubmitEvent("update")}
            type="submit"
            block
          >
            Update category
          </Button>
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          <Button
            onClick={() => setSubmitEvent("delete")}
            type="submit"
            block
          >
            Delete category
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};
