import React, { useState, useEffect } from "react";
import {
  Form,
  Col,
  Button,
  Dropdown,
  ButtonGroup,
  Alert,
  Table,
} from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../Form.scss";
import "./Table.scss";

const ADD_CATEGORY = gql`
  mutation($name: String!) {
    createCategory(category: { name: $name }) {
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation($id: ID!, $name: String!) {
    updateCategory(id: $id, category: { name: $name }) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation($id: ID!) {
    deleteCategory(id: $id)
  }
`;

const CATEGORIES = gql`
  {
    allCategories(limit: 100, page: 1) {
      categories {
        id
        name
        slug
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    categoriesData,
    categoriesLoading,
    categoriesError,
    deleteCategory,
    successCategoryDelete,
    errorCategoryDelete,
    setShowCategoryResponse,
    tableClick,
  } = props;

  if (categoriesLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Category Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Loading...</tr>
        </tbody>
      </Table>
    );
  }

  if (categoriesError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Category Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {categoriesError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id) {
    deleteCategory({
      variables: { id: id },
      refetchQueries: [{ query: CATEGORIES }],
    })
      .then(() => successCategoryDelete(id))
      .catch(() => errorCategoryDelete(id));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Category Name</th>
          <th>Category Slug</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {categoriesData.map((category, key) => {
          return (
            <tr onClick={() => tableClick(category.id)} key={key}>
              <td className="column">{category.id}</td>
              <td className="column">{category.name}</td>
              <td className="column">{category.slug}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowCategoryResponse(false);
                    remove(category.id);
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export const Categories = () => {
  const [
    createCategory,
    { loading: categoryAddLoading, error: addCategoryError },
  ] = useMutation(ADD_CATEGORY);
  const [
    updateCategory,
    { loading: categoryUpdateLoading, error: updateCategoryError },
  ] = useMutation(UPDATE_CATEGORY);
  const [
    deleteCategory,
    { loading: categoryDeleteLoading, error: deleteCategoryError },
  ] = useMutation(DELETE_CATEGORY);

  const [categoryNameDisabled, setCategoryNameDisabled] = useState(false);
  const [categoryIDDisabled, setCategoryIDDisabled] = useState(true);
  const [categorySubmitEvent, setCategorySubmitEvent] = useState("Add");
  const [categoryVariant, setCategoryVariant] = useState(String);
  const [categoryReponse, setCategoryResponse] = useState(String);
  const [showCategoryReponse, setShowCategoryResponse] = useState(false);
  const [categoryName, setCategoryName] = useState(String);
  const [categoryID, setCategoryID] = useState(String);
  const [categoryIDPlaceholder, setCategoryIDPlaceholder] = useState(String);
  const [categories, setCategories] = useState([]);
  const [categoryNamePlaceholder, setCategoryNamePlaceholder] = useState(
    "category name"
  );

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(CATEGORIES);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.allCategories.categories);
  });

  function tableClick(id) {
    if (categorySubmitEvent === "Update" || categorySubmitEvent === "Delete") {
      setCategoryID(id);
    }
  }

  function successCategoryAdd() {
    setCategoryResponse(`Successfully added '${categoryName}' category!`);
    setCategoryVariant("success");
    setCategoryName("");
    setCategoryID("");
    setShowCategoryResponse(true);
  }

  function errorCategoryAdd() {
    setCategoryResponse(`Category '${categoryName}' was not added!`);
    setCategoryVariant("danger");
    setShowCategoryResponse(true);
  }

  function successCategoryUpdate() {
    setCategoryResponse(
      `Successfully updated ID: '${categoryID}' category to '${categoryName}'!`
    );
    setCategoryVariant("success");
    setCategoryName("");
    setCategoryID("");
    setShowCategoryResponse(true);
  }

  function errorCategoryUpdate() {
    setCategoryResponse(`Category ID: '${categoryID}' was not updated!`);
    setCategoryVariant("danger");
    setShowCategoryResponse(true);
  }

  function successCategoryDelete(id) {
    if (id) {
      setCategoryResponse(`Category ID: '${id}' was successfully deleted!`);
    } else {
      setCategoryResponse(
        `Category ID: '${categoryID}' was successfully deleted!`
      );
    }
    setCategoryVariant("success");
    setCategoryName("");
    setCategoryID("");
    setShowCategoryResponse(true);
  }

  function errorCategoryDelete(id) {
    if (id) {
      setCategoryResponse(`Category ID: '${id}' was not deleted!`);
    } else {
      setCategoryResponse(`Category ID: '${categoryID}' was not deleted!`);
    }
    setCategoryVariant("danger");
    setShowCategoryResponse(true);
  }

  function handleCategorySubmit() {
    switch (categorySubmitEvent) {
      case "Add":
        createCategory({
          variables: { name: categoryName },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryAdd())
          .catch(() => errorCategoryAdd());
        break;

      case "Update":
        updateCategory({
          variables: { id: categoryID, name: categoryName },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryUpdate())
          .catch(() => errorCategoryUpdate());
        break;

      case "Delete":
        deleteCategory({
          variables: { id: categoryID },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryDelete())
          .catch(() => errorCategoryDelete());
        break;

      default:
        setShowCategoryResponse(true);
        setCategoryResponse("Error!!!");
        setCategoryVariant("danger");
    }
    if (addCategoryError) {
      errorCategoryAdd();
    } else if (updateCategoryError) {
      errorCategoryUpdate();
    } else if (deleteCategoryError) {
      errorCategoryDelete();
    }
  }

  return (
    <div className="dev">
      <Form
        className="dev-form"
        onSubmit={(event) => handleCategorySubmit(event.preventDefault())}
      >
        <div className="title-div">
          <Form.Label className="title">Category</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalCategoryName">
          <Form.Label column>Category name</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={categoryNamePlaceholder}
              value={categoryName}
              onChange={(event) => {
                setShowCategoryResponse(false);
                setCategoryName(event.target.value);
              }}
              required
              disabled={categoryNameDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalCategoryID">
          <Form.Label column>Category ID</Form.Label>
          <Col>
            <Form.Control
              type="number"
              placeholder={categoryIDPlaceholder}
              value={categoryID}
              onChange={(event) => {
                setShowCategoryResponse(false);
                setCategoryID(event.target.value);
              }}
              required
              disabled={categoryIDDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Col>
            <Dropdown className="event-dropdown" drop="right" as={ButtonGroup}>
              <Button variant="primary" className="event-button" type="submit">
                {categorySubmitEvent} category
              </Button>

              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Add");
                    setCategoryNameDisabled(false);
                    setCategoryIDDisabled(true);
                    setCategoryNamePlaceholder("category name");
                    setCategoryIDPlaceholder("");
                    setCategoryID("");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Add
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Update");
                    setCategoryNameDisabled(false);
                    setCategoryIDDisabled(false);
                    setCategoryNamePlaceholder("category name");
                    setCategoryIDPlaceholder("category id");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Update
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Delete");
                    setCategoryNameDisabled(true);
                    setCategoryIDDisabled(false);
                    setCategoryNamePlaceholder("");
                    setCategoryName("");
                    setCategoryIDPlaceholder("category id");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Group>

        {(categoryAddLoading ||
          categoryUpdateLoading ||
          categoryDeleteLoading) && (
          <Form.Group>
            <Col>
              <Alert variant="info">Working...</Alert>
            </Col>
          </Form.Group>
        )}

        {showCategoryReponse && (
          <Form.Group>
            <Col>
              <Alert variant={categoryVariant}>{categoryReponse}</Alert>
            </Col>
          </Form.Group>
        )}
      </Form>

      <ContentTable
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        categoriesData={categories}
        deleteCategory={deleteCategory}
        successCategoryDelete={successCategoryDelete}
        errorCategoryDelete={errorCategoryDelete}
        setShowCategoryResponse={setShowCategoryResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
