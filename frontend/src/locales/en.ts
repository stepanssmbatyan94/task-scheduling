export default {
  locale: {
    en: 'English',
    ru: 'Russian'
  },

  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  },

  signInToYourAccount: 'Sign in to your account',
  search: 'Search',
  loginInfo: 'Login Information',
  additionalInfo: 'Additional Information',
  username: 'Username',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  personalInfo: 'Personal Information',
  firstName: 'First Name',
  lastName: 'Last Name',
  firstNameKh: 'First Name (Khmer)',
  lastNameKh: 'Last Name (Khmer)',
  fullName: 'Full Name',
  fullNameKh: 'Full Name (Khmer)',
  email: 'E-mail',
  phoneNumber: 'Phone Number',
  status: 'Status',
  actions: 'Actions',
  description: 'Description',
  permissions: 'Permissions',
  selectAll: 'Select all',

  signIn: 'Sign in',
  forgotPassword: 'Forgot password?',
  forgotYourPassword: 'Forgot your password?',
  submit: 'Submit',
  save: 'Save',
  saveAsDraft: 'Save as draft',
  cancel: 'Cancel',
  update: 'Update',
  back: 'Back',
  create: 'Create',
  view: 'View',
  edit: 'Edit',
  details: 'Details',
  active: 'Active',
  deactivated: 'Deactivated',
  viewDetails: 'View Details',
  loading: 'Loading...',

  login: {
    placeholder: {
      email: 'Enter your email address',
      password: 'Enter your password'
    },
    details: 'Task Details',
    validation: {
      email: 'Please enter a valid email address.',
      password: 'Please enter a password.'
    }
  },

  dashboard: 'Dashboard',
  userManagement: 'User Management',
  user: {
    label: 'User',
    description:
      'Managing users includes functionalities such as user authentication, permissions, profile management, password control, activity tracking, account deactivation/suspension, and user communication.',
    list: 'Users',
    category: 'Category',
    addNew: 'Add New User',
    edit: 'Edit User'
  },

  role: {
    label: 'Role',
    list: 'Roles',
    info: 'Role Information',
    name: 'Role Name',
    nameEn: 'Role Name',
    nameKh: 'Role Name (Khmer)',
    roleType: 'Role Type',
    addNew: 'Add New Role',
    edit: 'Edit Role'
  },

  branch: {
    label: 'Branch',
    placeholder: 'Select Branch'
  },

  tasks: {
    board: 'Task Board',
    create: 'Create Task',
    edit: 'Edit Task',
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    assignee: 'Assignee',
    unassigned: 'Unassigned',
    emptyState: 'No items',
    fields: {
      title: 'Title',
      description: 'Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      assignedUser: 'Assigned User',
      status: 'Status'
    },
    placeholders: {
      title: 'Enter task title',
      description: 'Enter task description (optional)',
      assignedUser: 'Select a team member',
      status: 'Select status'
    },
    filters: {
      searchPlaceholder: 'Search tasks',
      clearSearch: 'Clear search',
      assignedUsersPlaceholder: 'Filter by assignees',
      clearAssignedUsers: 'Clear',
      selectAllUsers: 'Select all assignees'
    },
    messages: {
      loading: 'Loading tasks...',
      loadError: 'Error loading tasks. Please try again.',
      statusUpdating: 'Updating task status...',
      statusFailed: 'Failed to update task status. Please try again.',
      createSuccess: 'Task created successfully.',
      updateSuccess: 'Task updated successfully.'
    },
    notifications: {
      assigned: 'You have been assigned to "{title}".',
      reassigned: 'Task "{title}" has been reassigned to you.'
    },
    assignment: {
      loading: 'Loading team members...',
      loadError: 'Unable to load team members.',
      inProgress: 'Updating task assignment...',
      unassign: 'Unassign',
      emptyList: 'No available team members.',
      noAssignee: 'No assignee selected',
      noEmail: 'Email unavailable',
      errors: {
        generic: 'Unable to update assignment. Please try again.',
        overlap: 'This user already has a task scheduled during this period.'
      }
    },
    status: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    dueDate: {
      tooltip: {
        overdue: 'Task expired {count} day ago | Task expired {count} days ago',
        today: 'Task is due today',
        upcoming: 'Due in {count} day | Due in {count} days'
      }
    }
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    userHasOverlappingTask: 'This user already has a task scheduled during this period.'
  },
  validation: {
    required: '{field} is required.',
    maxCharacters: 'Maximum {count} characters allowed.',
    invalidDate: 'Invalid date selected.',
    endDateBeforeStartDate: 'End date cannot be before start date.'
  }
};
