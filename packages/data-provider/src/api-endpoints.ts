import type { AssistantsEndpoint } from './schemas';
import * as q from './types/queries';

// Testing this buildQuery function
const buildQuery = (params: Record<string, unknown>): string => {
  const query = Object.entries(params)
    .filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    })
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&');
      }
      return `${key}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
  return query ? `?${query}` : '';
};

export const health = () => '/librechat/health';
export const user = () => '/librechat/api/user';

export const balance = () => '/librechat/api/balance';

export const userPlugins = () => '/librechat/api/user/plugins';

export const deleteUser = () => '/librechat/api/user/delete';

export const messages = (params: q.MessagesListParams) => {
  const { conversationId, messageId, ...rest } = params;

  if (conversationId && messageId) {
    return `/librechat/api/messages/${conversationId}/${messageId}`;
  }

  if (conversationId) {
    return `/librechat/api/messages/${conversationId}`;
  }

  return `/librechat/api/messages${buildQuery(rest)}`;
};

const shareRoot = '/librechat/api/share';
export const shareMessages = (shareId: string) => `${shareRoot}/${shareId}`;
export const getSharedLink = (conversationId: string) => `${shareRoot}/link/${conversationId}`;
export const getSharedLinks = (
  pageSize: number,
  isPublic: boolean,
  sortBy: 'title' | 'createdAt',
  sortDirection: 'asc' | 'desc',
  search?: string,
  cursor?: string,
) =>
  `${shareRoot}?pageSize=${pageSize}&isPublic=${isPublic}&sortBy=${sortBy}&sortDirection=${sortDirection}${
    search ? `&search=${search}` : ''
  }${cursor ? `&cursor=${cursor}` : ''}`;
export const createSharedLink = (conversationId: string) => `${shareRoot}/${conversationId}`;
export const updateSharedLink = (shareId: string) => `${shareRoot}/${shareId}`;

const keysEndpoint = '/librechat/api/keys';

export const keys = () => keysEndpoint;

export const userKeyQuery = (name: string) => `${keysEndpoint}?name=${name}`;

export const revokeUserKey = (name: string) => `${keysEndpoint}/${name}`;

export const revokeAllUserKeys = () => `${keysEndpoint}?all=true`;

export const conversationsRoot = '/librechat/api/convos';

export const conversations = (params: q.ConversationListParams) => {
  return `${conversationsRoot}${buildQuery(params)}`;
};

export const conversationById = (id: string) => `${conversationsRoot}/${id}`;

export const genTitle = () => `${conversationsRoot}/gen_title`;

export const updateConversation = () => `${conversationsRoot}/update`;

export const deleteConversation = () => `${conversationsRoot}`;

export const deleteAllConversation = () => `${conversationsRoot}/all`;

export const importConversation = () => `${conversationsRoot}/import`;

export const forkConversation = () => `${conversationsRoot}/fork`;

export const duplicateConversation = () => `${conversationsRoot}/duplicate`;

export const search = (q: string, cursor?: string | null) =>
  `/librechat/api/search?q=${q}${cursor ? `&cursor=${cursor}` : ''}`;

export const searchEnabled = () => '/librechat/api/search/enable';

export const presets = () => '/librechat/api/presets';

export const deletePreset = () => '/librechat/api/presets/delete';

export const aiEndpoints = () => '/librechat/api/endpoints';

export const endpointsConfigOverride = () => '/librechat/api/endpoints/config/override';

export const models = () => '/librechat/api/models';

export const tokenizer = () => '/librechat/api/tokenizer';

export const login = () => '/librechat/api/auth/login';

export const logout = () => '/librechat/api/auth/logout';

export const register = () => '/librechat/api/auth/register';

export const loginFacebook = () => '/librechat/api/auth/facebook';

export const loginGoogle = () => '/librechat/api/auth/google';

export const refreshToken = (retry?: boolean) =>
  `/librechat/api/auth/refresh${retry === true ? '?retry=true' : ''}`;

export const requestPasswordReset = () => '/librechat/api/auth/requestPasswordReset';

export const resetPassword = () => '/librechat/api/auth/resetPassword';

export const verifyEmail = () => '/librechat/api/user/verify';

export const resendVerificationEmail = () => '/librechat/api/user/verify/resend';

export const plugins = () => '/librechat/api/plugins';

export const config = () => '/librechat/api/config';

export const prompts = () => '/librechat/api/prompts';

export const assistants = ({
  path = '',
  options,
  version,
  endpoint,
  isAvatar,
}: {
  path?: string;
  options?: object;
  endpoint?: AssistantsEndpoint;
  version: number | string;
  isAvatar?: boolean;
}) => {
  let url = isAvatar === true ? `${images()}/assistants` : `/librechat/api/assistants/v${version}`;

  if (path && path !== '') {
    url += `/${path}`;
  }

  if (endpoint) {
    options = {
      ...(options ?? {}),
      endpoint,
    };
  }

  if (options && Object.keys(options).length > 0) {
    const queryParams = new URLSearchParams(options as Record<string, string>).toString();
    url += `?${queryParams}`;
  }

  return url;
};

export const agents = ({ path = '', options }: { path?: string; options?: object }) => {
  let url = '/librechat/api/agents';

  if (path && path !== '') {
    url += `/${path}`;
  }

  if (options && Object.keys(options).length > 0) {
    const queryParams = new URLSearchParams(options as Record<string, string>).toString();
    url += `?${queryParams}`;
  }

  return url;
};

export const revertAgentVersion = (agent_id: string) => `${agents({ path: `${agent_id}/revert` })}`;

export const files = () => '/librechat/api/files';
export const fileUpload = () => '/librechat/api/files';
export const fileDelete = () => '/librechat/api/files';
export const fileDownload = (userId: string, fileId: string) =>
  `/librechat/api/files/download/${userId}/${fileId}`;
export const fileConfig = () => '/librechat/api/files/config';
export const agentFiles = (agentId: string) => `/librechat/api/files/agent/${agentId}`;

export const images = () => `${files()}/images`;

export const avatar = () => `${images()}/avatar`;

export const speech = () => `${files()}/speech`;

export const speechToText = () => `${speech()}/stt`;

export const textToSpeech = () => `${speech()}/tts`;

export const textToSpeechManual = () => `${textToSpeech()}/manual`;

export const textToSpeechVoices = () => `${textToSpeech()}/voices`;

export const getCustomConfigSpeech = () => `${speech()}/config/get`;

export const getPromptGroup = (_id: string) => `${prompts()}/groups/${_id}`;

export const getPromptGroupsWithFilters = (filter: object) => {
  let url = `${prompts()}/groups`;
  if (Object.keys(filter).length > 0) {
    const queryParams = new URLSearchParams(filter as Record<string, string>).toString();
    url += `?${queryParams}`;
  }
  return url;
};

export const getPromptsWithFilters = (filter: object) => {
  let url = prompts();
  if (Object.keys(filter).length > 0) {
    const queryParams = new URLSearchParams(filter as Record<string, string>).toString();
    url += `?${queryParams}`;
  }
  return url;
};

export const getPrompt = (_id: string) => `${prompts()}/${_id}`;

export const getRandomPrompts = (limit: number, skip: number) =>
  `${prompts()}/random?limit=${limit}&skip=${skip}`;

export const postPrompt = prompts;

export const updatePromptGroup = getPromptGroup;

export const updatePromptLabels = (_id: string) => `${getPrompt(_id)}/labels`;

export const updatePromptTag = (_id: string) => `${getPrompt(_id)}/tags/production`;

export const deletePromptGroup = getPromptGroup;

export const deletePrompt = ({ _id, groupId }: { _id: string; groupId: string }) => {
  return `${prompts()}/${_id}?groupId=${groupId}`;
};

export const getCategories = () => '/librechat/api/categories';

export const getAllPromptGroups = () => `${prompts()}/all`;

/* Roles */
export const roles = () => '/librechat/api/roles';
export const getRole = (roleName: string) => `${roles()}/${roleName.toLowerCase()}`;
export const updatePromptPermissions = (roleName: string) => `${getRole(roleName)}/prompts`;
export const updateMemoryPermissions = (roleName: string) => `${getRole(roleName)}/memories`;
export const updateAgentPermissions = (roleName: string) => `${getRole(roleName)}/agents`;

/* Conversation Tags */
export const conversationTags = (tag?: string) =>
  `/librechat/api/tags${tag != null && tag ? `/${encodeURIComponent(tag)}` : ''}`;

export const conversationTagsList = (pageNumber: string, sort?: string, order?: string) =>
  `${conversationTags()}/list?pageNumber=${pageNumber}${sort ? `&sort=${sort}` : ''}${
    order ? `&order=${order}` : ''
  }`;

export const addTagToConversation = (conversationId: string) =>
  `${conversationTags()}/convo/${conversationId}`;

export const userTerms = () => '/librechat/api/user/terms';
export const acceptUserTerms = () => '/librechat/api/user/terms/accept';
export const banner = () => '/librechat/api/banner';

// Message Feedback
export const feedback = (conversationId: string, messageId: string) =>
  `/librechat/api/messages/${conversationId}/${messageId}/feedback`;

// Two-Factor Endpoints
export const enableTwoFactor = () => '/librechat/api/auth/2fa/enable';
export const verifyTwoFactor = () => '/librechat/api/auth/2fa/verify';
export const confirmTwoFactor = () => '/librechat/api/auth/2fa/confirm';
export const disableTwoFactor = () => '/librechat/api/auth/2fa/disable';
export const regenerateBackupCodes = () => '/librechat/api/auth/2fa/backup/regenerate';
export const verifyTwoFactorTemp = () => '/librechat/api/auth/2fa/verify-temp';

/* Memories */
export const memories = () => '/librechat/api/memories';
export const memory = (key: string) => `${memories()}/${encodeURIComponent(key)}`;
export const memoryPreferences = () => `${memories()}/preferences`;
