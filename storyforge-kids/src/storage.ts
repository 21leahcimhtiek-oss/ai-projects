import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Character, ChatMessage, MarketingContent } from './types';

const KEYS = {
  BOOKS: '@queen_aurora:books',
  CHARACTERS: '@queen_aurora:characters',
  CHAT_HISTORY: '@queen_aurora:chat_history',
  MARKETING: '@queen_aurora:marketing',
};

// Books
export async function getBooks(): Promise<Book[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
}

export async function saveBook(book: Book): Promise<void> {
  try {
    const books = await getBooks();
    const index = books.findIndex(b => b.id === book.id);
    
    if (index >= 0) {
      books[index] = book;
    } else {
      books.push(book);
    }
    
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  try {
    const books = await getBooks();
    const filtered = books.filter(b => b.id !== bookId);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}

export async function getBook(bookId: string): Promise<Book | null> {
  try {
    const books = await getBooks();
    return books.find(b => b.id === bookId) || null;
  } catch (error) {
    console.error('Error getting book:', error);
    return null;
  }
}

// Characters
export async function getCharacters(): Promise<Character[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHARACTERS);
    if (data) {
      return JSON.parse(data);
    }
    
    // Return default characters if none exist
    const defaultCharacters: Character[] = [
      {
        id: '1',
        name: 'Queen Aurora Lightbringer',
        description: '5-year-old protagonist with a vivid imagination',
        visualNotes: 'Wild curly red hair, big round glasses, homemade cardboard crown painted gold, colorful pajamas',
        personality: 'Strong-willed, imaginative, sees herself as a dragon queen. Reframes challenges as royal adventures.'
      },
      {
        id: '2',
        name: 'Apprentice Azrael',
        description: 'Aurora\'s baby sister, the "hatchling"',
        visualNotes: 'Baby wrapped in pink blanket, curious dark eyes, drools a lot',
        personality: 'Innocent, adorable, looks up to Aurora as her mentor'
      },
      {
        id: '3',
        name: 'The King (Dad)',
        description: 'Aurora\'s father, patient and supportive',
        visualNotes: 'Tired but loving dad, often has messy hair from lack of sleep',
        personality: 'Patient, plays along with Aurora\'s imagination, uses reframing techniques'
      },
      {
        id: '4',
        name: 'The Queen (Mom)',
        description: 'Aurora\'s mother, wise and understanding',
        visualNotes: 'Warm, caring mom with dark circles under eyes but always smiling',
        personality: 'Understanding, creative in handling Aurora\'s strong will, empathetic'
      }
    ];
    
    await AsyncStorage.setItem(KEYS.CHARACTERS, JSON.stringify(defaultCharacters));
    return defaultCharacters;
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
}

export async function saveCharacter(character: Character): Promise<void> {
  try {
    const characters = await getCharacters();
    const index = characters.findIndex(c => c.id === character.id);
    
    if (index >= 0) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    await AsyncStorage.setItem(KEYS.CHARACTERS, JSON.stringify(characters));
  } catch (error) {
    console.error('Error saving character:', error);
    throw error;
  }
}

// Chat History
export async function getChatHistory(): Promise<ChatMessage[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

export async function saveChatMessage(message: ChatMessage): Promise<void> {
  try {
    const history = await getChatHistory();
    history.push(message);
    
    // Keep only last 100 messages
    const trimmed = history.slice(-100);
    
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}

export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}

// Marketing Content
export async function getMarketingContent(bookId?: string): Promise<MarketingContent[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.MARKETING);
    const all: MarketingContent[] = data ? JSON.parse(data) : [];
    
    if (bookId) {
      return all.filter(m => m.bookId === bookId);
    }
    
    return all;
  } catch (error) {
    console.error('Error loading marketing content:', error);
    return [];
  }
}

export async function saveMarketingContent(content: MarketingContent): Promise<void> {
  try {
    const all = await getMarketingContent();
    const index = all.findIndex(m => m.id === content.id);
    
    if (index >= 0) {
      all[index] = content;
    } else {
      all.push(content);
    }
    
    await AsyncStorage.setItem(KEYS.MARKETING, JSON.stringify(all));
  } catch (error) {
    console.error('Error saving marketing content:', error);
    throw error;
  }
}
