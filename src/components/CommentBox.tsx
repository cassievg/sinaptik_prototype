import { useState, useRef } from 'react'

export interface MentionableUser {
  id: string
  name: string
  avatar: string
  role: 'LEARNER' | 'MENTOR'
}

export interface CommentEntry {
  id: string
  text: string
  selectedText: string
  offsetTop: number
  mentions: MentionableUser[]
  authorName: string
  authorAvatar: string
  createdAt: string
}

interface CommentBoxProps {
  mentionables: MentionableUser[]
  author: { name: string; avatar: string }
  contextLabel?: string
  placeholder?: string
  onSubmit: (text: string, mentions: MentionableUser[], contextLabel?: string) => void
  onCancel?: () => void
  compact?: boolean
}

export function buildMentionables(
  learners: { id: string; name: string; avatar: string }[],
  mentors: { id: string; name: string; avatar: string }[]
): MentionableUser[] {
  const map = new Map<string, MentionableUser>()
  learners.forEach((l) => map.set(l.id, { ...l, role: 'LEARNER' }))
  mentors.forEach((m) => map.set(m.id, { ...m, role: 'MENTOR' }))
  return Array.from(map.values())
}

function extractMentions(text: string, mentionables: MentionableUser[]): MentionableUser[] {
  return mentionables.filter((u) => text.includes(`@${u.name}`))
}

function filterMentionables(query: string, mentionables: MentionableUser[]): MentionableUser[] {
  const q = query.trim().toLowerCase()
  if (!q) return mentionables
  return mentionables.filter((u) => u.name.toLowerCase().includes(q))
}

export function renderCommentText(text: string) {
  const parts = text.split(/(@[^@\n]+)/g)
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="font-medium text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function MentionDropdown({
  users,
  onSelect,
}: {
  users: MentionableUser[]
  onSelect: (user: MentionableUser) => void
}) {
  const students = users.filter((u) => u.role === 'LEARNER')
  const mentors = users.filter((u) => u.role === 'MENTOR')

  if (users.length === 0) {
    return <p className="px-3 py-2 text-xs text-stone-500">No matches</p>
  }

  return (
    <>
      {students.length > 0 && (
        <div>
          <p className="border-b border-stone-100 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-500">
            Students
          </p>
          {students.map((user) => (
            <MentionOption key={user.id} user={user} onSelect={onSelect} />
          ))}
        </div>
      )}
      {mentors.length > 0 && (
        <div>
          <p className="border-b border-t border-stone-100 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-500">
            Mentors
          </p>
          {mentors.map((user) => (
            <MentionOption key={user.id} user={user} onSelect={onSelect} />
          ))}
        </div>
      )}
    </>
  )
}

function MentionOption({
  user,
  onSelect,
}: {
  user: MentionableUser
  onSelect: (user: MentionableUser) => void
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(user)}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-stone-50"
    >
      <img src={user.avatar} alt="" className="h-6 w-6 rounded-full border border-stone-200" />
      <span className="text-stone-900">{user.name}</span>
    </button>
  )
}

export default function CommentBox({
  mentionables,
  author,
  contextLabel,
  placeholder = 'Write feedback. Type @ to mention someone.',
  onSubmit,
  onCancel,
  compact = false,
}: CommentBoxProps) {
  const [text, setText] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filtered = filterMentionables(mentionQuery, mentionables)

  const handleChange = (value: string) => {
    setText(value)
    const match = value.match(/@([^@\n]*)$/)
    if (match) {
      setShowPicker(true)
      setMentionQuery(match[1])
    } else {
      setShowPicker(false)
      setMentionQuery('')
    }
  }

  const insertMention = (user: MentionableUser) => {
    const before = text.replace(/@([^@\n]*)$/, '')
    const next = `${before}@${user.name} `
    setText(next)
    setShowPicker(false)
    setMentionQuery('')
    textareaRef.current?.focus()
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim(), extractMentions(text, mentionables), contextLabel)
    setText('')
    setShowPicker(false)
  }

  return (
    <div className={`border border-stone-300 bg-stone-50 ${compact ? 'p-3' : 'p-4'}`}>
      {contextLabel && (
        <p className="mb-2 text-xs text-stone-600">
          On: &quot;{contextLabel.slice(0, 60)}
          {contextLabel.length > 60 ? '...' : ''}&quot;
        </p>
      )}

      <p className="mb-2 text-xs text-stone-500">{author.name}</p>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowPicker(false)
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
          onBlur={() => {
            window.setTimeout(() => setShowPicker(false), 150)
          }}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="w-full resize-none border border-stone-300 bg-white p-3 text-sm focus:border-accent focus:outline-none"
        />

        {showPicker && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-md border border-stone-300 bg-white shadow-lg">
            <MentionDropdown users={filtered} onSelect={insertMention} />
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={!text.trim()} className="btn-primary text-sm">
          Post comment
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
