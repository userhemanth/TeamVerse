from django.test import TestCase
from .algorithm import calculate_match_score


class MatchingAlgorithmTests(TestCase):

    def test_perfect_match(self):
        score = calculate_match_score(['Python', 'Django', 'React'], ['Python', 'Django', 'React'])
        self.assertEqual(score, 100.0)

    def test_partial_match(self):
        score = calculate_match_score(['Python', 'Django'], ['Python', 'Django', 'React'])
        self.assertAlmostEqual(score, 66.7, delta=0.5)

    def test_below_threshold(self):
        score = calculate_match_score(['Python'], ['Python', 'Django', 'React', 'MySQL'])
        self.assertEqual(score, 0)

    def test_no_required_skills(self):
        score = calculate_match_score(['Python'], [])
        self.assertEqual(score, 0)

    def test_college_bonus(self):
        score = calculate_match_score(
            ['Python', 'Django', 'React'], ['Python', 'Django', 'React'],
            user_college='MIT', project_college='MIT'
        )
        self.assertEqual(score, 100.0)  # capped at 100

    def test_no_skills_match(self):
        score = calculate_match_score(['Flutter', 'Dart'], ['Python', 'Django'])
        self.assertEqual(score, 0)

    def test_case_insensitive(self):
        score = calculate_match_score(['python', 'DJANGO'], ['Python', 'Django'])
        self.assertEqual(score, 100.0)
