<template>
  <Dialog
    :visible="visible"
    modal
    :header="t('tasks.create')"
    :style="{ width: '520px' }"
    @update:visible="onVisibilityChange"
  >
    <form class="task-create-form" @submit.prevent="onSubmit">
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

      <div class="task-create-form__row">
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

      <div class="task-create-form__actions">
        <Button
          type="button"
          severity="secondary"
          :label="t('cancel')"
          @click="handleCancel"
        />
        <Button
          type="submit"
          :label="isSubmitting ? t('loading') : t('tasks.create')"
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
import type { AssignableUser, CreateTaskPayload, TaskStatus } from '../../task-type';
import {
  buildTaskCreateSchema,
  type TaskCreateFormValues
} from './schema';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    statuses: TaskStatus[];
    assignableUsers: AssignableUser[];
    assignableUsersLoading: boolean;
    isSubmitting: boolean;
  }>(),
  {
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

const schema = buildTaskCreateSchema(t);

const initialValues = (): TaskCreateFormValues => {
  const todayIso = new Date().toISOString().split('T')[0];

  return {
    title: '',
    description: '',
    startDate: todayIso,
    endDate: todayIso,
    assignedUserId: '',
    statusId: ''
  };
};

const { handleSubmit, resetForm } = useForm<TaskCreateFormValues>({
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

const normalizePayload = (values: TaskCreateFormValues): CreateTaskPayload => {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    startDate: values.startDate,
    endDate: values.endDate,
    assignedUser: {
      id: Number.isNaN(Number(values.assignedUserId))
        ? values.assignedUserId
        : Number(values.assignedUserId)
    },
    status: {
      id: Number.isNaN(Number(values.statusId)) ? values.statusId : Number(values.statusId)
    }
  };
};

const onSubmit = handleSubmit((values) => {
  emit('submit', normalizePayload(values));
});

const handleCancel = () => {
  emit('close');
};

const onVisibilityChange = (isVisible: boolean) => {
  if (!isVisible) {
    emit('close');
  }
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
</script>

<style src="./TaskCreateModal.styles.css" scoped></style>
