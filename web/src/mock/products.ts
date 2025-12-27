import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

const CUSTOM_NAMES = [
  "Trà sữa trân châu đen",
  "Trà sữa trân châu trắng",
  "Trà sữa trân châu hoàng kim",
  "Trà sữa truyền thống",
  "Trà sữa ít đường",
  "Trà sữa không đường",
  "Trà sữa socola",
  "Trà sữa caramel",
  "Trà sữa bạc hà",
  "Trà sữa vani",
  "Trà sữa matcha",
  "Trà sữa hồng trà",
  "Trà sữa lục trà",
  "Trà sữa ô long",
  "Trà sữa trà đen",
  "Trà sữa trà xanh",
  "Trà sữa hoa nhài",
  "Trà sữa Earl Grey",
  "Trà sữa kem cheese",
  "Trà sữa macchiato",
  "Trà sữa pudding trứng",
  "Trà sữa pudding socola",
  "Trà sữa flan",
  "Trà sữa sương sáo",
  "Trà sữa thạch cà phê",
  "Trà sữa thạch trái cây",
  "Trà sữa dâu",
  "Trà sữa xoài",
  "Trà sữa đào",
  "Trà sữa vải",
  "Trà sữa kiwi",
  "Trà sữa chuối",
  "Trà sữa việt quất",
  "Trà sữa dưa lưới",
  "Trà sữa trân châu + pudding",
  "Trà sữa trân châu + thạch phô mai",
  "Trà sữa 3Q",
  "Trà sữa trân châu đường đen",
  "Trà sữa full topping",
  "Trà sữa trân châu mini",
  "Trà sữa gạo rang",
  "Trà sữa khoai môn",
  "Trà sữa khoai lang tím",
  "Trà sữa dừa",
  "Trà sữa hạnh nhân",
  "Trà sữa mè đen",
  "Trà sữa yến mạch",
  "Trà sữa sầu riêng",
  "Trà sữa phô mai tươi",
  "Trà sữa kem trứng",

];

export const PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  const title = CUSTOM_NAMES[i] ?? `Sản phẩm #${n}`; 
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  return {
    _id: `p${n}`,
    title,
    slug,
    price: 30000 + (n % 2) * 10000,
    images: [`/anh/${ i + 1 <=30 ? i + 1:"placeholder"}.jfif`],
    stock: n % 7 === 0 ? 0 : ((n * 3) % 21) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [{ color: COLORS[n % COLORS.length], size: SIZES[n % SIZES.length] }],
    description: "Mô tả ngắn cho sản phẩm.",
    category: n % 2 ? "fashion" : "accessories",
  } satisfies Product;
});






