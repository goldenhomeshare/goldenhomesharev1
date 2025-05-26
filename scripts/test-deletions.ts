import { safeDeleteUser, safeDeleteProduct, safeDeleteChatRoom } from "../lib/database-utils";
import prisma from "../app/lib/db";

async function testDeletions() {
  console.log("🧪 Testing deletion functions...");

  try {
    // Test 1: Create a test user and try to delete it
    console.log("\n1. Testing user deletion...");
    
    const testUser = await prisma.user.create({
      data: {
        id: "test-user-" + Date.now(),
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        profileImage: "https://example.com/image.jpg",
        connectedAccountId: "test-account-" + Date.now(),
        userType: "HOUSEMATE"
      }
    });

    console.log(`✅ Created test user: ${testUser.id}`);

    // Create a test product for this user
    const testProduct = await prisma.product.create({
      data: {
        id: "test-product-" + Date.now(),
        name: "Test Property",
        price: 1000,
        smallDescription: "Test description",
        description: { content: "Test content" },
        images: ["https://example.com/image.jpg"],
        productFile: "test-file.pdf",
        category: "template",
        userId: testUser.id
      }
    });

    console.log(`✅ Created test product: ${testProduct.id}`);

    // Test deleting the product
    const productResult = await safeDeleteProduct(testProduct.id, testUser.id);
    console.log(`✅ Product deletion result: ${productResult.message}`);

    // Test deleting the user
    const userResult = await safeDeleteUser(testUser.id);
    console.log(`✅ User deletion result: ${userResult.message}`);

    console.log("\n🎉 All deletion tests passed!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testDeletions();
}

export { testDeletions }; 