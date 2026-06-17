<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gameConfig from '../config/gameConfig'
import { calculateSMSReplyChance, getSMSTimeLabel, getTimeLabel, getTimeUntilReply } from '../utils/gameUtils'
import type { SMSOption, PendingSMS } from '../types/game'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()
const selectedOptionId = ref<string | null>(null)

const currentCharacterConfig = computed(() => gameStore.currentCharacterConfig)

const availableOptions = computed(() => gameStore.availableSMSOptions)

const pendingForCharacter = computed(() => {
  if (!gameStore.selectedCharacterId) return []
  return gameStore.pendingSMS.filter(
    s => s.characterId === gameStore.selectedCharacterId && !s.replied
  )
})

const repliedHistory = computed(() => {
  if (!gameStore.selectedCharacterId) return []
  return gameStore.pendingSMS
    .filter(s => s.characterId === gameStore.selectedCharacterId && s.replied)
    .slice()
    .reverse()
    .slice(0, 5)
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

function getPendingTimeLabel(sms: PendingSMS): string {
  const remaining = getTimeUntilReply(
    gameStore.day,
    gameStore.timeSlot,
    sms.replyDay,
    sms.replyTime,
    gameConfig.timeSlots
  )
  if (remaining <= 0) return '即将回复'
  if (remaining === 1) return '还有1个时段'
  return `还有${remaining}个时段`
}

function getOptionText(optionId: string): string {
  return gameConfig.smsOptions.find(o => o.id === optionId)?.text || ''
}

function sendSMS() {
  if (!selectedOptionId.value) return
  const success = gameStore.sendSMS(selectedOptionId.value)
  if (success) {
    selectedOptionId.value = null
  }
}

function handleClose() {
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

        <div v-if="!currentCharacterConfig" class="no-character">
          请先选择一个角色
        </div>

        <template v-else>
          <div class="sms-target">
            <span class="target-avatar">{{ currentCharacterConfig.avatar }}</span>
            <span class="target-name">与 {{ currentCharacterConfig.name }} 的短信</span>
            <span v-if="pendingForCharacter.length > 0" class="pending-badge">
              {{ pendingForCharacter.length }} 条待回复
            </span>
          </div>

          <!-- 待回复的短信 -->
          <div v-if="pendingForCharacter.length > 0" class="pending-section">
            <h3 class="section-title">
              <span class="section-icon">⏳</span>
              等待回复
            </h3>
            <div class="pending-list">
              <div
                v-for="sms in pendingForCharacter"
                :key="sms.id"
                class="pending-item"
              >
                <div class="pending-header">
                  <span class="pending-text">「{{ getOptionText(sms.optionId) }}」</span>
                </div>
                <div class="pending-meta">
                  <span class="pending-time">
                    发送于 第{{ sms.sentDay }}天 {{ getTimeLabel(sms.sentTime) }}
                  </span>
                  <span class="pending-countdown">
                    {{ getPendingTimeLabel(sms) }}
                    <span class="pending-reply-time">
                      （预计第{{ sms.replyDay }}天 {{ getTimeLabel(sms.replyTime) }}）
                    </span>
                  </span>
                </div>
                <div class="pending-progress-bar">
                  <div
                    class="pending-progress-fill"
                    :style="{
                      width: `${Math.max(5, 100 - (getTimeUntilReply(
                        gameStore.day, gameStore.timeSlot,
                        sms.replyDay, sms.replyTime, gameConfig.timeSlots
                      ) / sms.timeCost) * 100)}%`
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 可发送的新话题 -->
          <div class="compose-section">
            <h3 class="section-title">
              <span class="section-icon">✉️</span>
              发送新短信
            </h3>

            <div v-if="availableOptions.length === 0" class="no-options">
              <p>暂时没有可以发送的邀约话题</p>
              <p class="hint-text">提升好感度可能解锁更多话题</p>
            </div>

            <div v-else class="sms-list">
              <div
                v-for="option in availableOptions"
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
          </div>

          <!-- 历史回复 -->
          <div v-if="repliedHistory.length > 0" class="history-section">
            <h3 class="section-title">
              <span class="section-icon">📜</span>
              历史短信
            </h3>
            <div class="history-list">
              <div
                v-for="sms in repliedHistory"
                :key="sms.id"
                class="history-item"
                :class="sms.accepted ? 'history-accept' : 'history-reject'"
              >
                <div class="history-row">
                  <span class="history-status">{{ sms.accepted ? '✅ 已接受' : '❌ 已婉拒' }}</span>
                  <span class="history-date">第{{ sms.sentDay }}天</span>
                </div>
                <div class="history-content">
                  <div class="history-sent">我：{{ getOptionText(sms.optionId) }}</div>
                  <div class="history-reply">{{ getCharacterName(sms.characterId) }}：{{ sms.replyText }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <span class="current-resources">
              行动力：{{ gameStore.actionsRemaining }}
            </span>
            <div class="footer-buttons">
              <button class="btn btn-secondary" @click="handleClose">关闭</button>
              <button
                class="btn btn-primary"
                :disabled="!selectedOptionId || gameStore.actionsRemaining <= 0"
                @click="sendSMS"
              >
                发送
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

.pending-badge {
  margin-left: auto;
  font-size: 12px;
  padding: 2px 10px;
  background: #f59e0b;
  color: white;
  border-radius: 9999px;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}

.section-icon {
  font-size: 16px;
}

.pending-section {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-light);
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pending-item {
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: var(--radius-md);
}

[data-theme='dark'] .pending-item {
  background: #451a03;
  border-color: #d97706;
}

.pending-header {
  margin-bottom: 8px;
}

.pending-text {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
}

.pending-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.pending-countdown {
  font-weight: 500;
  color: #d97706;
}

[data-theme='dark'] .pending-countdown {
  color: #fbbf24;
}

.pending-reply-time {
  color: var(--text-muted);
  font-weight: 400;
}

.pending-progress-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

[data-theme='dark'] .pending-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.pending-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.compose-section {
  margin-bottom: 16px;
}

.no-options {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
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
  max-height: 280px;
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

.history-section {
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
  margin-bottom: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 6px;
}

.history-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  line-height: 1.5;
}

.history-accept {
  background: #f0fdf4;
  border-left: 3px solid #22c55e;
}

.history-reject {
  background: #fef2f2;
  border-left: 3px solid #ef4444;
}

[data-theme='dark'] .history-accept {
  background: #14532d;
}

[data-theme='dark'] .history-reject {
  background: #7f1d1d;
}

.history-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.history-status {
  font-weight: 600;
  font-size: 11px;
}

.history-date {
  font-size: 11px;
  color: var(--text-muted);
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-sent {
  color: var(--text-secondary);
}

.history-reply {
  color: var(--text-primary);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
