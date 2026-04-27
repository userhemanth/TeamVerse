"""
Skill-based matching algorithm for TeamVerse.
- Base score = (overlapping skills / required skills) * 100
- 30% minimum threshold: scores below 30 return 0
- College bonus: +10 if same college
- Year bonus: +5 if same year (capped at 100)
"""


def calculate_match_score(user_skills, required_skills, user_college='', project_college='', user_year=None, project_year=None):
    if not required_skills:
        return 0

    user_skills_lower = set(s.lower().strip() for s in user_skills)
    required_lower = [s.lower().strip() for s in required_skills]

    matched = sum(1 for skill in required_lower if skill in user_skills_lower)
    base_score = (matched / len(required_lower)) * 100

    bonus = 0
    if user_college and project_college and user_college.strip().lower() == project_college.strip().lower():
        bonus += 10
    if user_year and project_year and user_year == project_year:
        bonus += 5

    final_score = min(base_score + bonus, 100)

    if final_score < 30:
        return 0

    return round(final_score, 1)


def match_users_to_project(project, users):
    results = []
    for user in users:
        if user == project.owner:
            continue
        score = calculate_match_score(
            user_skills=user.skills,
            required_skills=project.required_skills,
            user_college=user.college,
            project_college=project.college,
        )
        if score > 0:
            results.append({'user': user, 'score': score})
    results.sort(key=lambda x: x['score'], reverse=True)
    return results


def match_projects_to_user(user, projects):
    results = []
    for project in projects:
        if project.status != 'OPEN':
            continue
        score = calculate_match_score(
            user_skills=user.skills,
            required_skills=project.required_skills,
            user_college=user.college,
            project_college=project.college,
        )
        if score > 0:
            results.append({'project': project, 'score': score})
    results.sort(key=lambda x: x['score'], reverse=True)
    return results
