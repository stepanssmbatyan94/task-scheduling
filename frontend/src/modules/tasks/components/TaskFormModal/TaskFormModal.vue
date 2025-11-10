<template>
  <Dialog
    :visible="visible"
    modal
    :style="{ width: '520px' }"
    @update:visible="onVisibilityChange"
  >
    <template #header>
      <div class="task-form-modal__header">
        <span class="task-form-modal__title">{{ headerTitle }}</span>
      </div>
    </template>

    <form id="task-form-modal-form" class="task-form-modal__content" @submit.prevent="onSubmit">
      <InputField
        name="title"
        :label="t('tasks.fields.title')"
        :placeholder="t('tasks.placeholders.title')"
        required
      />

      <TextAreaField
        name="description"
        :label="t('tasks.fields.description')"
        :placeholder="t('tasks.placeholders.description')"
        :rows="4"
      />

      <div class="task-form-modal__row">
        <InputField
          name="startDate"
          type="date"
          :label="t('tasks.fields.startDate')"
          required
        />
        <InputField
          name="endDate"
          type="date"
          :label="t('tasks.fields.endDate')"
          required
        />
      </div>

      <SelectField
        name="assignedUserId"
        :label="t('tasks.fields.assignedUser')"
        :placeholder="t('tasks.placeholders.assignedUser')"
        :options="assignableUserOptions"
        option-label="label"
        option-value="value"
        :loading="assignableUsersLoading"
        required
      />

      <SelectField
        name="statusId"
        :label="t('tasks.fields.status')"
        :placeholder="t('tasks.placeholders.status')"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        required
      />

      <div class="task-form-modal__actions">
        <Button
          type="button"
          severity="secondary"
          :label="t('cancel')"
          @click="emitClose"
        />
        <Button
          type="submit"
          :label="submitLabel"
          :disabled="isSubmitting"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import Dialog from 'primevue/dialog';

import {
  Button,
  InputField,
  SelectField,
  TextAreaField
} from '@/components';
import { useTranslation } from '@/composables';
import type { AssignableUser, CreateTaskPayload, Task, TaskStatus } from '../../task-type';
import {
  buildTaskFormSchema,
  type TaskFormValues
} from './schema';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    mode: 'create' | 'edit';
    task: Task | null;
    statuses: TaskStatus[];
    assignableUsers: AssignableUser[];
    assignableUsersLoading: boolean;
    isSubmitting: boolean;
  }>(),
  {
    task: null,
    statuses: () => [],
    assignableUsers: () => [],
    assignableUsersLoading: false,
    isSubmitting: false
  }
);

const emit = defineEmits<{
  close: [];
  submit: [payload: CreateTaskPayload];
}>();

const { t } = useTranslation();

const schema = buildTaskFormSchema(t);

const toInputDateString = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  if (value.includes('T')) {
    return value.split('T')[0];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
};

const todayInputDate = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
};

const initialValues = (): TaskFormValues => {
  if (!props.task) {
    const today = todayInputDate();
    return {
      title: '',
      description: '',
      startDate: today,
      endDate: today,
      assignedUserId: '',
      statusId: ''
    };
  }

  return {
    title: props.task.title ?? '',
    description: props.task.description ?? '',
    startDate: toInputDateString(props.task.startDate),
    endDate: toInputDateString(props.task.endDate),
    assignedUserId: props.task.assignedUser ? String(props.task.assignedUser.id) : '',
    statusId: props.task.status ? String(props.task.status.id) : ''
  };
};

const { handleSubmit, resetForm, setValues } = useForm<TaskFormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues()
});

const statusOptions = computed(() =>
  props.statuses.map((status) => ({
    label: formatStatusName(status.name),
    value: String(status.id)
  }))
);

const assignableUserOptions = computed(() =>
  props.assignableUsers.map((user) => ({
    label: formatUserDisplayName(user),
    value: String(user.id)
  }))
);

const headerTitle = computed(() =>
  props.mode === 'create'
    ? t('tasks.create')
    : props.task?.title || t('tasks.edit')
);

const submitLabel = computed(() =>
  props.isSubmitting
    ? t('loading')
    : props.mode === 'create'
      ? t('tasks.create')
      : t('save')
);

const formatStatusName = (statusName: string): string => {
  return statusName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatUserDisplayName = (user: AssignableUser): string => {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email;
  }

  return t('tasks.assignment.noAssignee');
};

const parseIdentifier = (value: string) =>
  Number.isNaN(Number(value)) ? value : Number(value);

const normalizePayload = (formValues: TaskFormValues): CreateTaskPayload => {
  return {
    title: formValues.title.trim(),
    description: formValues.description?.trim() || undefined,
    startDate: formValues.startDate,
    endDate: formValues.endDate,
    assignedUser: {
      id: parseIdentifier(formValues.assignedUserId)
    },
    status: {
      id: parseIdentifier(formValues.statusId)
    }
  };
};

const onSubmit = handleSubmit((formValues) => {
  emit('submit', normalizePayload(formValues));
});

const onVisibilityChange = (isVisible: boolean) => {
  if (!isVisible) {
    emitClose();
  }
};

const emitClose = () => {
  emit('close');
};

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      resetForm({
        values: initialValues()
      });
    }
  }
);

watch(
  () => props.task,
  (task) => {
    if (!task) {
      resetForm({
        values: initialValues()
      });
      return;
    }

    setValues(initialValues(), {
      shouldValidate: false,
      force: true
    });
  }
);
</script>

<style src="./TaskFormModal.styles.css" scoped></style>

