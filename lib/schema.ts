import { z } from 'zod';

// Job Requirements Extraction Schema
export const JobRequirementsSchema = z.object({
  must_have_skills: z.array(z.string()).max(10),
  nice_to_have_skills: z.array(z.string()).max(8),
  hard_requirements: z.array(z.string()),
  role_keywords: z.array(z.string()).max(25),
  seniority: z.enum(['junior', 'mid', 'senior']),
  domain: z.string(),
});

// Optimization Result Schema
export const OptimizationResultSchema = z.object({
  score: z.number().min(0).max(100),
  gaps: z.array(z.string()),
  missing_keywords: z.array(z.string()).optional(),
  rewritten_bullets: z.array(z.string()),
  professional_summary: z.string(),
  cover_letter: z.string(),
  ats_keywords: z.array(z.string()),
  notes: z.array(z.string()),
});

// Request Schemas
export const OptimizeRequestSchema = z.object({
  resumeText: z.string().min(1),
  jobAdText: z.string().min(1),
  role: z.string().optional(),
  saveSession: z.boolean().optional().default(false),
});

export const ExportRequestSchema = z.object({
  resultJson: OptimizationResultSchema,
  format: z.enum(['docx', 'pdf']),
  templateId: z.string().optional(),
  userData: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

// Export Data Schema for templates
export const ExportDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      start: z.string(),
      end: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
  ).optional(),
  skills: z.array(z.string()).optional(),
  ats_keywords: z.array(z.string()).optional(),
});

export type JobRequirements = z.infer<typeof JobRequirementsSchema>;
export type OptimizationResult = z.infer<typeof OptimizationResultSchema>;
export type OptimizeRequest = z.infer<typeof OptimizeRequestSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
export type ExportData = z.infer<typeof ExportDataSchema>;


