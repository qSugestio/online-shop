export type ProductT = {
  id?: number
  brand: string
  model: string
  rom: string
  ram: string
  price: string
  img: string
  [key: string]: any
}

export type ProductTCart = ProductT & {
  cart: boolean
}

export type ContextType = {
  searchData: string
  setSearchData: React.Dispatch<React.SetStateAction<string>>
}
export type CartContextType = {
  cart: ProductT[]
  setCart: React.Dispatch<React.SetStateAction<ProductT[]>>
}
export type Product = {
  id: number
  userId: number
  productId: number
}
