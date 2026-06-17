<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gameConfig from '../config/gameConfig'
import { calculateSMSReplyChance, getSMSTimeLabel } from '../utils/gameUtils'
import type { SMSOption } from '../types/game'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()
const selectedOptionId = ref<string | null>(null)
const showReply = ref(false)

const currentCharacterConfig = computed(() => gameStore.currentCharacterConfig)

const smsOptionsForCharacter = computed(() => {
  return gameStore.availableSMSOptions
})

const repliedHistory = computed(() => {
  if (!gameStore.selectedCharacterId) return []
  return gameStore.pendingSMS
    .filter(s => s.characterId === gameStore.selectedCharacterId && s.replied)
    .slice(-5)
})

function getAcceptChance(option: SMSOption): number {
  const charState = gameStore.getCharacterState(option.characterId)
  if (!charState) return 0
  return calculateSMSReplyChance(option, charState.affinity, charState.mood, gameConfig.maxAffinity)
}

function getChanceLabel(chance: number): string {
  const pct = Math.round(chance * 100)
  if (pct >= 80) return '很可能'
  if (pct >= 60) return '比较可能'
  if (pct >= 40) return '一般'
  if (pct >= 20) return '不太可能'
  return '希望渺茫'
}

function getChanceClass(chance: number): string {
  const pct = Math.round(chance * 100)
  if (pct >= 80) return 'chance-high'
  if (pct >= 60) return 'chance-good'
  if (pct >= 40) return 'chance-medium'
  if (pct >= 20) return 'chance-low'
  return 'chance-vlow'
}

function getCharacterName(characterId: string): string {
  return gameConfig.characters.find(c => c.id === characterId)?.name || ''
}

function getCharacterAvatar(characterId: string): string {
  return gameConfig.characters.find(c => c.id === characterId)?.avatar || ''
}

function sendSMS() {
  if (!selectedOptionId.value) return
  gameStore.sendSMS(selectedOptionId.value)
  showReply.value = true
}

function handleClose() {
  showReply.value = false
  selectedOptionId.value = null
  gameStore.dismissSMSReply()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="handleClose">
      <div class="modal-content sms-modal">
        <div class="modal-header">
          <h2>📱 短信邀约</h2>
          <button class="close-btn" @click="handleClose">✕</button>
        </div>

        <div v-if="showReply && gameStore.lastSMSReply" class="reply-section animate-fade-in">
          <div class="phone-screen" :class="gameStore.lastSMSReply.accepted ? 'phone-positive' : 'phone-negative'">
            <div class="phone-header">
              <span class="phone-avatar">{{ getCharacterAvatar(gameStore.lastSMSReply.characterId) }}</span>
              <span class="phone-name">{{ getCharacterName(gameStore.lastSMSReply.characterId) }}</span>
            </div>
            <div class="phone-messages">
              <div class="msg-bubble msg-sent">
                {{ gameConfig.smsOptions.find(o => o.id === gameStore.lastSMSReply!.optionId)?.text }}
              </div>
              <div class="msg-bubble msg-received" :class="gameStore.lastSMSReply.accepted ? 'msg-accept' : 'msg-reject'">
                {{ gameStore.lastSMSReply.replyText }}
              </div>
            </div>
            <div class="reply-status" :class="gameStore.lastSMSReply.accepted ? 'status-accept' : 'status-reject'">
              <span v-if="gameStore.lastSMSReply.accepted">✅ 邀约成功！</span>
              <span v-else>❌ 被婉拒了...</span>
            </div>
          </div>
          <button class="btn btn-primary reply-close-btn" @click="showReply = false; gameStore.dismissSMSReply()">
            知道了
          </button>
        </div>

        <template v-else>
          <div v-if="!currentCharacterConfig" class="no-character">
            请先选择一个角色
          </div>

          <div v-else class="sms-target">
            <span class="target-avatar">{{ currentCharacterConfig.avatar }}</span>
            <span class="target-name">给 {{ currentCharacterConfig.name }} 发短信</span>
          </div>

          <div v-if="currentCharacterConfig && smsOptionsForCharacter.length === 0" class="no-options">
            <p>暂时没有可以发送的邀约话题</p>
            <p class="hint-text">提升好感度可能解锁更多话题</p>
          </div>

          <div v-else-if="currentCharacterConfig" class="sms-list">
            <div
              v-for="option in smsOptionsForCharacter"
              :key="option.id"
              class="sms-item"
              :class="{ selected: selectedOptionId === option.id }"
              @click="selectedOptionId = option.id"
            >
              <div class="sms-item-header">
                <span class="sms-text">{{ option.text }}</span>
              </div>
              <div class="sms-item-desc">{{ option.description }}</div>
              <div class="sms-item-meta">
                <span class="sms-time-cost">⏱ {{ getSMSTimeLabel(option.timeCost) }}</span>
                <span class="sms-chance" :class="getChanceClass(getAcceptChance(option))">
                  接受概率：{{ getChanceLabel(getAcceptChance(option)) }}（{{ Math.round(getAcceptChance(option) * 100) }}%）
                </span>
              </div>
            </div>
          </div>

          <div v-if="repliedHistory.length > 0" class="sms-history">
            <h3 class="history-title">历史短信</h3>
            <div
              v-for="sms in repliedHistory"
              :key="sms.id"
              class="history-item"
              :class="sms.accepted ? 'history-accept' : 'history-reject'"
            >
              <span class="history-status">{{ sms.accepted ? '✅' : '❌' }}</span>
              <span class="history-text">{{ sms.replyText }}</span>
            </div>
          </div>

          <div class="modal-footer">
            <span class="current-resources">
              行动力：{{ gameStore.actionsRemaining }}
            </span>
            <div class="footer-buttons">
              <button class="btn btn-secondary" @click="handleClose">取消</button>
              <button
                class="btn btn-primary"
                :disabled="!selectedOptionId || gameStore.actionsRemaining <= 0"
                @click="sendSMS"
              >
                发送短信
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sms-modal {
  padding: 24px;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--accent-light);
}

.no-character {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.sms-target {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--accent-light);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.target-avatar {
  font-size: 24px;
}

.target-name {
  font-weight: 500;
}

.no-options {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
}

.hint-text {
  font-size: 12px;
  margin-top: 6px;
  color: var(--text-secondary);
}

.sms-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.sms-item {
  padding: 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.sms-item:hover {
  background: var(--accent-light);
}

.sms-item.selected {
  border-color: var(--accent-primary);
  background: var(--accent-light);
}

.sms-item-header {
  margin-bottom: 6px;
}

.sms-text {
  font-weight: 600;
  font-size: 14px;
}

.sms-item-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.sms-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.sms-time-cost {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 9999px;
}

.sms-chance {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.chance-high {
  background: #dcfce7;
  color: #166534;
}

.chance-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.chance-medium {
  background: #fef3c7;
  color: #92400e;
}

.chance-low {
  background: #fee2e2;
  color: #991b1b;
}

.chance-vlow {
  background: #fce7f3;
  color: #9d174d;
}

[data-theme='dark'] .chance-high {
  background: #14532d;
  color: #86efac;
}

[data-theme='dark'] .chance-good {
  background: #1e3a5f;
  color: #93c5fd;
}

[data-theme='dark'] .chance-medium {
  background: #451a03;
  color: #fbbf24;
}

[data-theme='dark'] .chance-low {
  background: #7f1d1d;
  color: #fca5a5;
}

[data-theme='dark'] .chance-vlow {
  background: #831843;
  color: #f9a8d4;
}

.sms-history {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.history-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.history-item {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.4;
}

.history-accept {
  background: #f0fdf4;
}

.history-reject {
  background: #fef2f2;
}

[data-theme='dark'] .history-accept {
  background: #14532d;
}

[data-theme='dark'] .history-reject {
  background: #7f1d1d;
}

.history-status {
  flex-shrink: 0;
}

.history-text {
  color: var(--text-secondary);
  word-break: break-word;
}

.reply-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.phone-screen {
  width: 100%;
  border-radius: var(--radius-lg);
  padding: 16px;
  background: #1a1a2e;
}

.phone-positive {
  border: 2px solid #22c55e;
}

.phone-negative {
  border: 2px solid #ef4444;
}

.phone-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.phone-avatar {
  font-size: 24px;
}

.phone-name {
  color: #f1f5f9;
  font-weight: 600;
  font-size: 14px;
}

.phone-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  max-width: 85%;
  word-break: break-word;
}

.msg-sent {
  align-self: flex-end;
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-received {
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.msg-accept {
  background: #166534;
  color: #86efac;
}

.msg-reject {
  background: #7f1d1d;
  color: #fca5a5;
}

.reply-status {
  margin-top: 14px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.status-accept {
  color: #22c55e;
}

.status-reject {
  color: #ef4444;
}

.reply-close-btn {
  width: 100%;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.current-resources {
  font-size: 14px;
  color: var(--text-secondary);
}

.footer-buttons {
  display: flex;
  gap: 10px;
}
</style>
