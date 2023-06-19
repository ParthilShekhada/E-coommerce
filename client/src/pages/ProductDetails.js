import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import Layouts from "../components/Layouts/Layouts";
import { useCart } from "../context/cart";
import { toast } from "react-hot-toast";



const ProductDetails = () => {
    const [cart,setCart]=useCart()
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [category,setCategory]=useState("")

    //initalp details
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);
    //getProduct
    const getProduct = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/product/single-product/${params.slug}`
            );

            const categoryDetail = await axios.get(`${process.env.REACT_APP_API}/category/categorybyid/${data.Product.category}`)

            setCategory(categoryDetail.data.category.name)

            setProduct(data?.Product);
            getSimilarProduct(data?.Product._id, data?.Product.category);
        } catch (error) {
            console.log(error);
        }
    };
    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/product/related-product/${pid}/${cid}`
            );
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };


    const addToCart=async(p)=>{
        try {
          const existingProduct = cart.find((item) => item._id === p._id);
      
          if (existingProduct) {
            const updatedCart = cart.map((item) => {
                if (item._id === p._id) {
                    return {
                        ...item,
                        itemCount: item.itemCount + 1
                    };
                }
                return item;
            });
      
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.success("Quantity updated in cart");
      
        } else {
            setCart([...cart, {...p,itemCount:1}]);
            localStorage.setItem(
              "cart",
              JSON.stringify([...cart, p])
            );
            toast.success("Item Added to cart");
        }
          
         
           
          
        } catch (error) {
          
        }
      }
    return (
        <Layouts>
            <div className="row container product-details">
                <div className="col-md-5">
                    <img
                        src={`${process.env.REACT_APP_API}/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        style={{height:"297px"}}
                    />
                </div>
                <div className="col-md-6 product-details-info">
                    <h1 className="text-center">Product Details</h1>
                    <hr />
                    <h6>Name : {product.name}</h6>
                    <h6>Description : {product.description}</h6>
                    <h6>
                        Price :
                        {product?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </h6>
                    <h6>Category : {category}</h6>
                    <button className="btn btn-secondary ms-1"  onClick={()=>addToCart(product)}>ADD TO CART</button>
                </div>
            </div>
            <hr />
            <div className="row container similar-products">
                <h4>Similar Products ➡️</h4>
                {relatedProducts.length < 1 && (
                    <p className="text-center">No Similar Products found</p>
                )}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map((p) => (
                        <div className="card m-2" key={p._id}>
                            <img
                                src={`${process.env.REACT_APP_API}/product/product-photo/${p._id}`}
                                className="card-img-top"
                                alt={p.name}
                            />
                            <div className="card-body">
                                <div className="card-name-price">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h5 className="card-title card-price">
                                        {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </h5>
                                </div>
                                <p className="card-text ">
                                    {p.description.substring(0, 60)}...
                                </p>
                                <div className="card-name-price">
                                    <button
                                        className="btn btn-info ms-1"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        More Details
                                    </button>
                                    {/* <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, p])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
                </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layouts>
    );
};

export default ProductDetails;