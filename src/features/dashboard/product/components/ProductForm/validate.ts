import {
  required,
  url,
  maxNumber,
  minNumber,
  Validator,
  type Rule,
} from "@/core/validator";

export const validateTags =
  (maxTags = 10, maxLength = 50): Rule =>
  (value) => {
    if(!!value) return

    if (typeof value !== "string") {
      return "Invalid tags";
    }



    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      return "At least one tag is required";
    }

    if (tags.length > maxTags) {
      return `Maximum ${maxTags} tags allowed`;
    }

    const hasLongTag = tags.some((tag) => tag.length > maxLength);

    if (hasLongTag) {
      return `Each tag must not exceed ${maxLength} characters`;
    }

    return undefined;
  };

export const isSlug =
  (
    message = "Slug can only contain lowercase letters, numbers, and hyphens",
  ): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (typeof value !== "string") {
      return message;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(value.trim())) {
      return message;
    }

    return undefined;
  };

export const isSku =
  (
    message = "SKU can only contain uppercase letters, numbers, hyphens, and underscores",
  ): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (typeof value !== "string") {
      return message;
    }

    const skuRegex = /^[A-Z0-9_-]+$/;

    if (!skuRegex.test(value.trim())) {
      return message;
    }

    return undefined;
  };

export const productValidator = new Validator({
  sku: [required("SKU is required"), isSku()],
  slug: [required("Slug is required"), isSlug()],
  name: [required("Name is required")],

  price: [
    required("Price is required"),
    minNumber(1, "Price must be greater than 0"),
  ],

  originalPrice: [minNumber(0, "Original price must be >= 0")],

  discountPercent: [minNumber(0, "Min 0%"), maxNumber(100, "Max 100%")],

  thumbnail: [required("Thumbnail is required"), url()],

  brandId: [required("Brand is required")],
  tags: [validateTags()],
});
