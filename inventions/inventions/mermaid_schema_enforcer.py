import re
from typing import List, Tuple, Callable

class MermaidSchemaEnforcer:
    """
    Provides utilities for validating and transforming Mermaid diagram syntax
    to ensure compliance with patent-specific rubric rules, particularly for
    node label formatting.

    The primary rule enforced is: "never use parentheses () in node labels".
    This applies to the content within node definitions (e.g., [...], ((...)), {...}, >...]),
    subgraph titles ("..."), and note content ("...").
    It also applies to round nodes (ID(Label)), with a heuristic to distinguish them from link labels.
    """

    def __init__(self):
        # Regex patterns to capture the *content* of various Mermaid label blocks for validation.
        # Group 1 (or Group 2 for specific patterns) in these regexes represents the label content.
        self._validation_label_patterns = [
            # 1. Square brackets: A[Label] (nodes or link labels that contain labels)
            re.compile(r'\[([^\]]+)\]'),
            
            # 2. Double parentheses: A((Label))
            re.compile(r'\(\(([^)]+)\)\)'),
            
            # 3. Curly braces: A{Label}
            re.compile(r'\{([^}]+)\}'),
            
            # 4. Subgraph titles and note content: subgraph "Title", note "Content", note for X "Content"
            re.compile(r'(?:subgraph\s+|note(?:\s+for\s+\w+)?\s+)"([^"]+)"'),
            
            # 5. Round nodes: A(Label)
            # Group 1: NodeID, Group 2: Label content
            # This regex will match all `ID(content)` patterns. A heuristic is used in `validate_diagram`
            # to attempt to filter out link labels (e.g., A --> B (Link Label)).
            re.compile(r'(\w+)\s*\(([^)]+)\)'),
            
            # 6. Stadium nodes: A>Label]
            # Group 1: Content
            re.compile(r'\w+\s*>([^\]]+)\]'),

            # 7. Parallelogram nodes: A[/Label/]
            # Group 1: Content
            re.compile(r'\w+\s*\[\/([^\/]+)\/\]'),

            # 8. Inverse parallelogram nodes: A[\Label\]
            # Group 1: Content
            re.compile(r'\w+\s*\[\\([^\\]+)\\]')
        ]

        # Regex patterns for transformation. Each tuple contains:
        # (regex_to_match_full_label_block, 1_based_index_of_content_group_in_regex_match)
        # These regexes explicitly capture the delimiters and the content, allowing a callback
        # to replace only the content part while preserving the structure.
        self._transformation_patterns_with_content_idx = [
            # 1. Square brackets: (1=[)(2=Content)(3=])
            (re.compile(r'(\[)([^\]]+)(\])'), 2), 
            # 2. Double parentheses: (1=(( )(2=Content)(3=)))
            (re.compile(r'(\(\()([^)]+)(\)\))'), 2), 
            # 3. Curly braces: (1={)(2=Content)(3=})
            (re.compile(r'(\{)([^}]+)(\})'), 2), 
            # 4. Subgraph titles and note content: (1=subgraph ")(2=Content)(3=")
            (re.compile(r'(subgraph\s+"|note(?:\s+for\s+\w+)?\s+")([^"]+)(")'), 2), 
            # 5. Round nodes: (1=NodeID)(2=whitespace_and_open_paren)(3=Content)(4=close_paren)
            # A heuristic in `transform_diagram` ensures this primarily applies to node definitions.
            (re.compile(r'(\w+)(\s*\()([^)]+)(\))'), 3), 
            # 6. Stadium nodes: (1=NodeID>)(2=Content)(3=])
            (re.compile(r'(\w+\s*>)([^\]]+)(\])'), 2), 
            # 7. Parallelogram nodes: (1=NodeID[/)(2=Content)(3=/])
            (re.compile(r'(\w+\s*\[\/)([^\/]+)(\/\])'), 2), 
            # 8. Inverse parallelogram nodes: (1=NodeID[\)(2=Content)(3=\])
            (re.compile(r'(\w+\s*\[\\)([^\\]]+)(\\])'), 2)
        ]

    def validate_diagram(self, mermaid_text: str) -> Tuple[bool, List[str]]:
        """
        Validates a Mermaid diagram string against the rubric rule:
        "never use parentheses () in node labels".

        Args:
            mermaid_text (str): The Mermaid diagram source text.

        Returns:
            Tuple[bool, List[str]]: A tuple where the first element is True if compliant,
                                     False otherwise. The second element is a list of
                                     violation messages.
        """
        violations = []
        is_compliant = True

        for i, regex in enumerate(self._validation_label_patterns):
            for match in regex.finditer(mermaid_text):
                label_content = None
                
                if i == 4:  # This corresponds to the A(Label) regex: `(\w+)\s*\(([^)]+)\)`
                    # Heuristic to distinguish node labels from link labels (e.g., A --> B (Link Label)).
                    # If "-->", "---", or " -- " is found before this match on the same line,
                    # it's likely a link label, and should be skipped according to the "node labels" rule.
                    line_start = mermaid_text.rfind('\n', 0, match.start()) + 1
                    line_segment_before_match = mermaid_text[line_start : match.start()]
                    if '-->' in line_segment_before_match or '---' in line_segment_before_match or ' -- ' in line_segment_before_match:
                        continue # Skip: Likely a link label, not a node label.
                    label_content = match.group(2) # Content is in group 2 for this specific regex
                else:
                    label_content = match.group(1) # Content is in group 1 for other regexes
                
                if label_content and ('(' in label_content or ')' in label_content):
                    violations.append(f"Label '{label_content.strip()}' contains parentheses, which is a violation.")
                    is_compliant = False
        return is_compliant, violations

    def transform_diagram(self, mermaid_text: str, replacement_char: str = "") -> str:
        """
        Transforms a Mermaid diagram string by removing or replacing parentheses
        within node, subgraph, and note labels.

        Args:
            mermaid_text (str): The Mermaid diagram source text.
            replacement_char (str): The character to replace '(' and ')' with.
                                    Defaults to "" (removal) as per the prompt's examples.
                                    E.g., "User Input (Audio)" -> "User Input Audio".

        Returns:
            str: The transformed Mermaid diagram text.
        """
        transformed_text = mermaid_text
        
        # Inner helper callback function for re.sub to clean content within identified groups.
        def _clean_content_callback(match: re.Match, content_group_idx: int) -> str:
            original_content = match.group(content_group_idx)
            
            cleaned_content = original_content.replace('(', replacement_char).replace(')', replacement_char)
            if replacement_char:
                # Remove consecutive replacement chars (e.g., if replacement_char is '_', then '__' becomes '_')
                cleaned_content = re.sub(f'{re.escape(replacement_char)}+', replacement_char, cleaned_content)
                # Remove any leading/trailing replacement chars if the transformation results in them
                cleaned_content = cleaned_content.strip(replacement_char)
            
            # Reconstruct the string, replacing only the content part within the full match.
            # This ensures delimiters and other surrounding text are preserved.
            return match.group(0).replace(original_content, cleaned_content)

        # Apply transformations for each pattern type
        for i, (regex, content_group_idx) in enumerate(self._transformation_patterns_with_content_idx):
            if i == 4:  # This corresponds to the A(Content) node pattern
                # Custom logic for round nodes to avoid transforming link labels, similar to validation.
                def round_node_sub_callback(match: re.Match):
                    line_start = transformed_text.rfind('\n', 0, match.start()) + 1
                    line_segment_before_match = transformed_text[line_start : match.start()]
                    if '-->' in line_segment_before_match or '---' in line_segment_before_match or ' -- ' in line_segment_before_match:
                        # This is likely a link label (e.g., `A -- (Link Text) --> B`), return original match.
                        return match.group(0)
                    else:
                        # Otherwise, it's a node label, proceed with cleaning.
                        return _clean_content_callback(match, content_group_idx)
                
                # Apply the custom callback to this specific regex.
                transformed_text = regex.sub(round_node_sub_callback, transformed_text)
            else:
                # For all other label types, apply the generic cleaning callback directly.
                transformed_text = regex.sub(
                    lambda m: _clean_content_callback(m, content_group_idx),
                    transformed_text
                )

        return transformed_text

# Note: The seed file includes `logging` configuration. For a utility file,
# it's often better not to configure logging globally but allow the caller
# to configure it. If this file requires internal logging, ensure `import logging`
# is present and use `logging.getLogger(__name__)`. For this submission,
# direct logging configuration is omitted as per utility file best practices.