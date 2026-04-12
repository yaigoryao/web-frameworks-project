import { AuthStore } from './authStore';
import { CustomerDataStore } from './customerDataStore';
import { StaffReferenceStore } from './staffReferenceStore';
import { UsersListStore } from './usersListStore';
import { StaffUserDataStore } from './staffUserDataStore';

export class RootStore {
  authStore: AuthStore;
  customerDataStore: CustomerDataStore;
  staffReferenceStore: StaffReferenceStore;
  usersListStore: UsersListStore;
  staffUserDataStore: StaffUserDataStore;

  constructor() {
    this.customerDataStore = new CustomerDataStore();
    this.staffReferenceStore = new StaffReferenceStore();
    this.usersListStore = new UsersListStore();
    this.staffUserDataStore = new StaffUserDataStore(this);
    this.authStore = new AuthStore(this);
  }
}

let singleton: RootStore | null = null;

export function createRootStore(): RootStore {
  if (!singleton) {
    singleton = new RootStore();
  }
  return singleton;
}

export function resetRootStoreForTests(): void {
  singleton = null;
}
