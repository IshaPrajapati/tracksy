'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { getTask } from '@/actions/tasks'
import { createComment, createChecklistItem, updateChecklistItem, deleteChecklistItem } from '@/actions/tasks'
import { formatDate, formatRelative, PRIORITY_CONFIG, STATUS_CONFIG, getInitials, isOverdue } from '@/lib/utils'
import {
  Calendar, User, Tag, CheckSquare, MessageSquare, Paperclip,
  Plus, Trash2, Check, X, Send
} from 'lucide-react'
import { toast } from 'sonner'
import type { Task, Comment, TaskChecklist } from '@/types'
import { cn } from '@/lib/utils'

interface TaskDetailDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ task: initialTask, open, onOpenChange }: TaskDetailDialogProps) {
  const [task, setTask] = useState(initialTask)
  const [comment, setComment] = useState('')
  const [newCheckItem, setNewCheckItem] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isAddingCheck, setIsAddingCheck] = useState(false)

  useEffect(() => {
    if (open) {
      getTask(initialTask.id).then(({ data }) => { if (data) setTask(data as Task) })
    }
  }, [open, initialTask.id])

  const pc = PRIORITY_CONFIG[task.priority]
  const sc = STATUS_CONFIG[task.status]
  const checklists = task.checklists ?? []
  const completedChecks = checklists.filter((c) => c.is_completed).length
  const checkProgress = checklists.length > 0 ? Math.round((completedChecks / checklists.length) * 100) : 0

  async function submitComment() {
    if (!comment.trim()) return
    setIsSubmittingComment(true)
    const result = await createComment(task.id, comment.trim())
    if (result.error) {
      toast.error(result.error)
    } else {
      setComment('')
      // Refresh task
      const { data } = await getTask(task.id)
      if (data) setTask(data as Task)
    }
    setIsSubmittingComment(false)
  }

  async function addCheckItem() {
    if (!newCheckItem.trim()) return
    setIsAddingCheck(true)
    const result = await createChecklistItem(task.id, newCheckItem.trim())
    if (result.error) {
      toast.error(result.error)
    } else {
      setNewCheckItem('')
      const { data } = await getTask(task.id)
      if (data) setTask(data as Task)
    }
    setIsAddingCheck(false)
  }

  async function toggleCheck(item: TaskChecklist) {
    await updateChecklistItem(item.id, { is_completed: !item.is_completed })
    const { data } = await getTask(task.id)
    if (data) setTask(data as Task)
  }

  async function removeCheck(id: string) {
    await deleteChecklistItem(id)
    const { data } = await getTask(task.id)
    if (data) setTask(data as Task)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex gap-0 h-full">
          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title + badges */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={cn(pc.bg, pc.color, 'border-0')}>{pc.label}</Badge>
                <Badge className={cn(sc.bg, sc.color, 'border-0')}>{sc.label}</Badge>
                {isOverdue(task.due_date) && <Badge variant="destructive">Overdue</Badge>}
              </div>
              <h2 className="text-xl font-bold">{task.title}</h2>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{task.description}</p>
              )}
            </div>

            {/* Checklist */}
            {(checklists.length > 0 || true) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Checklist</h3>
                  {checklists.length > 0 && (
                    <span className="text-xs text-muted-foreground">{completedChecks}/{checklists.length}</span>
                  )}
                </div>
                {checklists.length > 0 && <Progress value={checkProgress} className="mb-3 h-1.5" />}
                <div className="space-y-2">
                  {checklists.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <button
                        onClick={() => toggleCheck(item)}
                        className={cn(
                          'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all',
                          item.is_completed ? 'bg-primary border-primary' : 'border-border hover:border-primary'
                        )}
                      >
                        {item.is_completed && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                      <span className={cn('text-sm flex-1', item.is_completed && 'line-through text-muted-foreground')}>
                        {item.title}
                      </span>
                      <button onClick={() => removeCheck(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCheckItem()}
                    placeholder="Add checklist item..."
                    className="flex-1 h-8 bg-background border border-input rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="icon-sm" onClick={addCheckItem} loading={isAddingCheck}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Attachments */}
            {(task.attachments?.length ?? 0) > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Attachments</h3>
                </div>
                <div className="space-y-2">
                  {task.attachments!.map((att) => (
                    <div key={att.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                      <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{att.file_name}</span>
                      {att.url && (
                        <a href={att.url} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">Download</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Comments</h3>
                <span className="text-xs text-muted-foreground">{task.comments?.length ?? 0}</span>
              </div>

              <div className="space-y-3 mb-4">
                {(task.comments ?? []).map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
                      <AvatarImage src={c.user?.avatar_url ?? ''} />
                      <AvatarFallback className="text-[10px]">{getInitials(c.user?.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{c.user?.full_name ?? 'User'}</span>
                        <span className="text-xs text-muted-foreground">{formatRelative(c.created_at)}</span>
                      </div>
                      <div className="text-sm bg-muted/50 rounded-xl px-3 py-2">{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() } }}
                />
                <Button size="icon" onClick={submitComment} loading={isSubmittingComment} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar metadata */}
          <div className="w-52 border-l border-border p-4 space-y-4 flex-shrink-0 bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assignee</p>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={task.assignee.avatar_url ?? ''} />
                    <AvatarFallback className="text-[10px]">{getInitials(task.assignee.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.full_name ?? 'Unknown'}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Due Date</p>
              <div className={cn('flex items-center gap-1.5 text-sm', isOverdue(task.due_date) && 'text-red-400')}>
                <Calendar className="w-3.5 h-3.5" />
                {task.due_date ? formatDate(task.due_date) : '—'}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Created</p>
              <p className="text-sm text-muted-foreground">{formatRelative(task.created_at)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Created by</p>
              {task.creator && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={task.creator.avatar_url ?? ''} />
                    <AvatarFallback className="text-[10px]">{getInitials(task.creator.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.creator.full_name ?? 'Unknown'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
