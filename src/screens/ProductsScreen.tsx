import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import apiService from "../services/api";
import { Product } from "../types/authTypes";
import { CartContext } from "../context/CartContext";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import { GlobleStyle } from "../components/GlobleStyle";

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { cart, addToCart, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiService.get<{ products: Product[] }>("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredProducts = searchTerm.trim()
    ? products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : products;

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getCartItem = (productId: number) => {
    return cart.find((item) => item.product.id === productId);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const cartItem = getCartItem(item.id);

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
        <View style={styles.productActions}>
          {cartItem ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, cartItem.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{cartItem.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CustomButton
              title="Add to Cart"
              onPress={() => addToCart(item)}
            />
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={GlobleStyle.circleTop} />
      <View style={GlobleStyle.circleBottom} />
      <View style={[styles.searchContainer, { marginTop: Platform.OS === "ios" ? -20 : 10 }]}>
        <MagnifyingGlassIcon
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.trim() !== "" && (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredProducts.length === 0 && searchTerm.trim() !== "" ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  clearButton: {
    fontSize: 20,
    color: "#999",
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  productActions: {
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "bold",
  },
});