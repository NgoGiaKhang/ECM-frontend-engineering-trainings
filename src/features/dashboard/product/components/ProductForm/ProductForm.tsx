import TextAreaField from "@/components/FormField/TextAreaField";
import TextField from "@/components/FormField/TextField";
import SubmitButton from "@/components/SubmitButton";
import Form from "@/components/FormField/Form";
import SelectField from "@/components/FormField/SelectField";
import { CategorySelect } from "@/features/dashboard/category";
import { BrandSelect } from "@/features/dashboard/brand";
import { productValidator } from "./validate";
import { FormContainer } from "@/components/FormField/FormContainer";
type ProductFormProps = {
    initialValues: ProductFormType;
    onSubmit: (data: ProductFormType) => Promise<void> | void;
    submitText?: string;
};

export type ProductFormType = {
    sku: string;
    slug: string;
    name: string;
    description: string;

    price: number;
    originalPrice?: number;
    discountPercent?: number;

    currency: "USD";

    isAvailable: boolean;

    thumbnail: string;
    images: string[];

    categoryId?: string;
    brandId: string;

    tags: string;
};


export function ProductForm({
    initialValues,
    onSubmit,
    submitText = "Save Product",
}: ProductFormProps) {
    const handleSubmit = async (data: ProductFormType) => {
        await onSubmit(data);
    };

    return (
        <FormContainer>
            <Form<ProductFormType>
                initialState={initialValues}
                onSubmit={handleSubmit}
                validator={productValidator}
            >
                {/* BASIC */}
                <TextField<ProductFormType>
                    name="sku"
                    label="SKU"
                />

                <TextField<ProductFormType>
                    name="slug"
                    label="Slug"
                />

                <TextField<ProductFormType>
                    name="name"
                    label="Product Name"
                />

                <TextAreaField<ProductFormType>
                    name="description"
                    label="Description"
                />

                {/* PRICE */}
                <TextField<ProductFormType>
                    name="price"
                    label="Price"
                    type="number"
                />

                <TextField<ProductFormType>
                    name="originalPrice"
                    label="Original Price"
                    type="number"
                />

                <TextField<ProductFormType>
                    name="discountPercent"
                    label="Discount %"
                    type="number"
                />

                {/* MEDIA */}
                <TextField<ProductFormType>
                    name="thumbnail"
                    label="Thumbnail URL"
                />

                {/* RELATION */}
                <SelectField<ProductFormType>
                    component={BrandSelect}
                    name="brandId"
                    label="Brand"
                    options={[]}
                />

                <SelectField<ProductFormType>
                    component={CategorySelect}
                    name="categoryId"
                    label="Category"
                    options={[]}
                />

                {/* TAGS */}
                <TextAreaField<ProductFormType>
                    name="tags"
                    label="Tags (comma separated)"
                />

                <SubmitButton>
                    {submitText}
                </SubmitButton>
            </Form>
        </FormContainer>
    );
}