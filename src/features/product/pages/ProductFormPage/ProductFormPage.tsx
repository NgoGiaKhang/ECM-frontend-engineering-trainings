// CreateProductForm.tsx

import Form from "../../../../components/FormField/Form";
import {
  required,
  url,
  minLength,
  minNumber,
} from "../../../../core/validator";
import { Validator } from "../../../../core/validator/Validator";
import { ActionSection } from "./ActionSection";
import { FieldSection } from "./FieldSection";
import styles from "./styles.module.css";

export type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string;
  imageUrl: string;
};

const initialState: FormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  tags: "",
  imageUrl: "",
};

const validator = new Validator({
  name: [required("Product name is required")],

  description: [
    required("Description is required"),
    minLength(10, "Description must be at least 10 characters"),
  ],

  price: [
    required("Price is required"),
    minNumber(1, "Price must be greater than 0"),
  ],

  category: [required("Category is required")],
  imageUrl: [required("Image URL is required"), url("Invalid image URL")],
});

export default function CreateProductForm() {
  return (
    <div className={styles.container}>
      <Form<FormData>
        initialState={initialState}
        className={styles.form}
        validator={validator}
        onSubmit={(e) => console.log(e)}
      >
        <div className={styles.header}>
          <h1>Create Product</h1>

          <p>Add new product to your store</p>
        </div>

        <FieldSection />
        <ActionSection />
      </Form>
    </div>
  );
}
