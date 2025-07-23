import "@fortawesome/fontawesome-free/css/all.css"
import Alpine from "alpinejs"
import { productListControl, cartControl } from "./appV2"
import { catData } from "./catdata"

window.Alpine = Alpine
Alpine.data("productListControl", productListControl)
Alpine.data("cartControl", cartControl)
Alpine.store("catData", catData)

Alpine.start()
