// 實作寫在這裡！
import axios from "axios"

const productListControl = () => {
  return {
    async getCatLlist() {
      const url = "http://localhost:3002/cats"
      try {
        const resp = await axios.get(url)
        this.$store.catData.productList = resp.data
      } catch (err) {
        console.log(err)
      }
    },

    async addToCart(cat) {
      const cartList = this.$store.catData.cartList
      const index = cartList.findIndex((c) => c.id === cat.id)

      if (index !== -1) {
        cartList[index].count++
      } else {
        cartList.push({ ...cat, count: 1 })
      }

      const url = "http://localhost:3002/cart"
    },
  }
}

const cartControl = () => {
  return {
    calcSubTotal(cat) {
      return Math.round(cat.price * cat.count * 100) / 100
    },

    calcTotal() {
      const total = this.$store.catData.cartList.reduce((acc, item) => {
        return acc + this.calcSubTotal(item)
      }, 0)
      return Math.round(total * 100) / 100
    },

    removeProduct(cat) {
      const cartList = this.$store.catData.cartList

      const index = cartList.findIndex((c) => c.id === cat.id)
      cartList.splice(index, 1)
    },

    resetCart() {
      this.$store.catData.cartList = []
    },
  }
}

export { productListControl, cartControl }
