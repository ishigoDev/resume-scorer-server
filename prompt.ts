  /**
   * Builds a prompt for LLM analysis
   * @param {string} resumeText - Cleaned resume text
   * @param {string} jdText - Cleaned job description text
   * @param {Object} keywordResult - Results from keyword matcher
   * @returns {string} Formatted prompt
   */
export const buildPrompt = (resumeText:string,jdText:string, keywordResult:any) =>{
    return `You are an expert resume reviewer and ATS optimizer. Analyze this resume against the job description and provide detailed feedback.

JOB DESCRIPTION:
${jdText.slice(0, 3000)}

RESUME:
${resumeText.slice(0, 3000)}

LOCAL KEYWORD ANALYSIS:
- Overall keyword match: ${keywordResult.keywordScore}%
- Skills match: ${keywordResult.skillsScore}%
- Missing key skills: ${keywordResult.missingSkills.slice(0, 10).join(', ') || 'None'}
- Missing keywords: ${keywordResult.missingKeywords.slice(0, 10).join(', ') || 'None'}

Provide a JSON response with:
1. overallScore (0-100): Holistic match score considering context, not just keywords
2. analysis (string): 3-4 paragraph detailed analysis covering strengths, gaps, and strategic advice
3. suggestions (string[]): 5-7 specific, actionable improvement suggestions
4. strengths (string[]): 3-4 key strengths of this resume for this role
5. redFlags (string[]): Any concerns (gaps, overqualification, missing critical requirements)

Return ONLY valid JSON, no markdown.`;
}