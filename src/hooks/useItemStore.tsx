
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Item {
  id: string;
  productName: string;
  location: string;
  description: string;
  type: 'normal' | 'emergency';
  status: 'lost' | 'found' | 'completed';
  date: Date;
  phone: string;
  imageUrl: string | null;
  userId: string;
  userName: string;
  createdAt: Date;
}

interface ItemContextType {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  bulkDeleteItems: (options: { dateRange?: { start: Date, end: Date }, type?: 'normal' | 'emergency' | 'both' }) => void;
  loading: boolean;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

// Mock items data
const INITIAL_ITEMS: Item[] = [
  {
    id: '1',
    productName: 'MacBook Pro',
    location: 'Library, 2nd Floor',
    description: 'Silver MacBook Pro 13", 2021 model with stickers on the cover',
    type: 'emergency',
    status: 'lost',
    date: new Date(2023, 4, 15),
    phone: '9876543210',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    userId: '2',
    userName: 'Regular User',
    createdAt: new Date(2023, 4, 15)
  },
  {
    id: '2',
    productName: 'ID Card',
    location: 'Cafeteria',
    description: 'Student ID Card for Saveetha Engineering College',
    type: 'normal',
    status: 'found',
    date: new Date(2023, 4, 17),
    phone: '9876543211',
    imageUrl: null,
    userId: '2',
    userName: 'Regular User',
    createdAt: new Date(2023, 4, 17)
  },
  {
    id: '3',
    productName: 'Calculator',
    location: 'Room 101',
    description: 'Scientific calculator, Casio FX-991EX',
    type: 'normal',
    status: 'completed',
    date: new Date(2023, 4, 10),
    phone: '9876543212',
    imageUrl: null,
    userId: '2',
    userName: 'Regular User',
    createdAt: new Date(2023, 4, 10)
  },
  {
    id: '4',
    productName: 'Wallet',
    location: 'Bus Stop',
    description: 'Black leather wallet with ID and debit cards',
    type: 'emergency',
    status: 'lost',
    date: new Date(2023, 4, 18),
    phone: '9876543213',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
    userId: '1',
    userName: 'Admin User',
    createdAt: new Date(2023, 4, 18)
  }
];

export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Load items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      try {
        // Parse stored items and convert date strings back to Date objects
        const parsedItems = JSON.parse(storedItems).map((item: any) => ({
          ...item,
          date: new Date(item.date),
          createdAt: new Date(item.createdAt)
        }));
        setItems(parsedItems);
      } catch (error) {
        console.error('Failed to parse stored items:', error);
        setItems(INITIAL_ITEMS);
        localStorage.setItem('items', JSON.stringify(INITIAL_ITEMS));
      }
    } else {
      setItems(INITIAL_ITEMS);
      localStorage.setItem('items', JSON.stringify(INITIAL_ITEMS));
    }
    setLoading(false);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('items', JSON.stringify(items));
    }
    
    // Auto-cleanup items older than 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setItems(currentItems => 
      currentItems.filter(item => new Date(item.createdAt) > thirtyDaysAgo)
    );
  }, [items, loading]);

  const addItem = (item: Item) => {
    setItems([...items, item]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const bulkDeleteItems = (options: { 
    dateRange?: { start: Date, end: Date }, 
    type?: 'normal' | 'emergency' | 'both' 
  }) => {
    let filteredItems = [...items];
    
    if (options.dateRange) {
      const { start, end } = options.dateRange;
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate < start || itemDate > end;
      });
    }
    
    if (options.type && options.type !== 'both') {
      filteredItems = filteredItems.filter(item => 
        item.type !== options.type
      );
    }
    
    setItems(filteredItems);
  };

  return (
    <ItemContext.Provider value={{
      items,
      addItem,
      updateItem,
      deleteItem,
      bulkDeleteItems,
      loading
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItemStore = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItemStore must be used within an ItemProvider');
  }
  return context;
};
