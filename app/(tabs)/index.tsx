import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
                style={styles.avatar} 
                contentFit="cover"
              />
            </View>
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.nameText}>Alex Chen</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#8D94A2" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search snacks, chargers, stationery..."
            placeholderTextColor="#A0A5B1"
          />
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerHeader}>
            <View style={styles.activeBatchBadge}>
              <Text style={styles.activeBatchText}>ACTIVE BATCH #125</Text>
            </View>
            <View style={styles.arrivesBadge}>
              <Text style={styles.arrivesLabel}>Arrives</Text>
              <Text style={styles.arrivesTime}>1h 20m</Text>
            </View>
          </View>

          <Text style={styles.bannerTitle}>Next Campus Delivery</Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Order window closing soon</Text>
            <Text style={styles.progressPercent}>75% Full</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>

          <TouchableOpacity style={styles.bannerButton}>
            <Ionicons name="cart-outline" size={20} color="#1C74E9" />
            <Text style={styles.bannerButtonText}>Join Batch Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity style={styles.quickLinkCard}>
            <View style={styles.quickLinkIconWrapper}>
              <Ionicons name="storefront-outline" size={22} color="#0F172A" />
            </View>
            <Text style={styles.quickLinkTitle}>Partner Shop</Text>
            <Text style={styles.quickLinkSubtitle}>Order from official shops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickLinkCard}>
            <View style={styles.quickLinkIconWrapper}>
              <Ionicons name="sync-circle-outline" size={24} color="#0F172A" />
            </View>
            <Text style={styles.quickLinkTitle}>Used Market</Text>
            <Text style={styles.quickLinkSubtitle}>Buy & sell with fellow students</Text>
          </TouchableOpacity>
        </View>

        {/* Campus Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Deals</Text>
          <View style={styles.limitedTimeBadge}>
            <Text style={styles.limitedTimeText}>LIMITED TIME</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsScrollContainer}>
          <TouchableOpacity style={styles.dealCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80' }} 
              style={styles.dealImage}
            />
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle} numberOfLines={1}>Chapati + Soda Combo</Text>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>1,500 RWF</Text>
                <Text style={styles.oldPrice}>2,200 RWF</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dealCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80' }} 
              style={styles.dealImage}
            />
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle} numberOfLines={1}>Late Night Snacks</Text>
              <Text style={styles.currentPrice}>3,000 RWF</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Active Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Active Orders</Text>
        </View>

        <TouchableOpacity style={styles.orderCard}>
          <View style={styles.orderIconWrapper}>
            <Ionicons name="cube-outline" size={24} color="#16A34A" />
          </View>
          
          <View style={styles.orderInfo}>
            <View style={styles.orderHeaderRow}>
              <Text style={styles.orderNumber}>Batch #124</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>On the way</Text>
              </View>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Ionicons name="location-outline" size={14} color="#1C74E9" />
              <Text style={styles.orderDetailTextBold}>Pickup: Main Gate</Text>
            </View>
            
            <View style={styles.orderDetailRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.orderDetailText}>Arrives: 12:00 PM</Text>
            </View>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#A0A5B1" />
        </TouchableOpacity>

        {/* Space for bottom tab bar padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4E6',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontSize: 13,
    color: '#64748B',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C74E9',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  bannerContainer: {
    backgroundColor: '#1C74E9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activeBatchBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBatchText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  arrivesBadge: {
    backgroundColor: '#4AA0F9', // slightly lighter blue
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  arrivesLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.9,
  },
  arrivesTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  progressPercent: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerButtonText: {
    color: '#1C74E9',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  quickLinkSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  limitedTimeBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  limitedTimeText: {
    color: '#1C74E9',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dealsScrollContainer: {
    gap: 16,
    paddingRight: 16, // to allow scroll past last item
    marginBottom: 32,
  },
  dealCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dealImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C74E9',
  },
  oldPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetailTextBold: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 6,
  },
  orderDetailText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
});
