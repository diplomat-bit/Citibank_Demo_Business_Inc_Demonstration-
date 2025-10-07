```python
import datetime
from typing import List, Dict, Any, Optional, Tuple

# Assume these are well-defined external modules or interfaces
from vector_db import VectorDatabaseClient, SemanticEmbedding
from gemini_client import GeminiClient, LLMResponse
from git_parser import GitRepositoryParser, CommitData, DiffSegment
from context_builder import LLMContextBuilder

# --- New Exported Classes and Components ---

class ExportedCodeComplexityMetrics:
    """
    Stores code complexity metrics for a diff segment or code block.
    This class is exported.
    """
    def __init__(self, cyclomatic_complexity: int = 0, sloc: int = 0, change_type: str = "modified"):
        self.cyclomatic_complexity = cyclomatic_complexity
        self.sloc = sloc
        self.change_type = change_type

    def to_dict(self) -> Dict[str, Any]:
        return {
            "cyclomatic_complexity": self.cyclomatic_complexity,
            "sloc": self.sloc,
            "change_type": self.change_type
        }
    
    def __repr__(self):
        return f"ExportedCodeComplexityMetrics(cc={self.cyclomatic_complexity}, sloc={self.sloc}, type='{self.change_type}')"


class ExportedEnrichedDiffSegment:
    """
    Wraps an original `DiffSegment` from `git_parser` and extends it with computed code complexity metrics.
    This class is exported.
    """
    def __init__(self, original_diff: DiffSegment, metrics: Optional[ExportedCodeComplexityMetrics] = None):
        self.original_diff = original_diff
        self.metrics = metrics if metrics is not None else ExportedCodeComplexityMetrics()
    
    @property
    def file_path(self) -> str:
        return self.original_diff.file_path
    
    @property
    def content(self) -> str:
        return self.original_diff.content
    
    def to_dict(self) -> Dict[str, Any]:
        base_dict = {"file_path": self.file_path, "content": self.content}
        if self.metrics:
            base_dict["metrics"] = self.metrics.to_dict()
        return base_dict

    def __repr__(self):
        return f"ExportedEnrichedDiffSegment(file_path='{self.file_path}', metrics={self.metrics})"


class ExportedEnrichedCommitData:
    """
    Stores comprehensive data for a single Git commit, including enriched diffs.
    Wraps the `CommitData` from `git_parser`.
    This class is exported.
    """
    def __init__(self, original_commit: CommitData,
                 enriched_diffs: List[ExportedEnrichedDiffSegment]):
        self.original_commit = original_commit
        self.enriched_diffs = enriched_diffs
    
    # Delegate properties to the original commit for convenience
    @property
    def hash(self) -> str: return self.original_commit.hash
    @property
    def author(self) -> str: return self.original_commit.author
    @property
    def author_email(self) -> str: return self.original_commit.author_email
    @property
    def author_date(self) -> datetime.datetime: return self.original_commit.author_date
    @property
    def committer(self) -> str: return self.original_commit.committer
    @property
    def committer_email(self) -> str: return self.original_commit.committer_email
    @property
    def committer_date(self) -> datetime.datetime: return self.original_commit.committer_date
    @property
    def message(self) -> str: return self.original_commit.message
    @property
    def parent_hashes(self) -> List[str]: return self.original_commit.parent_hashes
    
    # Original diffs for backward compatibility if needed by other modules
    @property
    def diffs(self) -> List[DiffSegment]: return self.original_commit.diffs

    def __repr__(self):
        return f"ExportedEnrichedCommitData(hash='{self.hash[:7]}', author='{self.author}', date='{self.author_date.date()}')"


class ExportedCodeComplexityAnalyzer:
    """
    Analyzes code diff segments to extract complexity metrics.
    Conceptual implementation, actual static analysis tools would be used.
    This class is exported.
    """
    def analyze_diff_segment(self, diff_segment: DiffSegment) -> ExportedCodeComplexityMetrics:
        """
        Analyzes a single `git_parser.DiffSegment` for complexity.
        This is a placeholder for actual static analysis tools.
        """
        content_lines = diff_segment.content.split('\n')
        
        change_type = "modified"
        added_lines = sum(1 for line in content_lines if line.startswith('+'))
        deleted_lines = sum(1 for line in content_lines if line.startswith('-'))
        if added_lines > 0 and deleted_lines == 0:
            change_type = "added"
        elif deleted_lines > 0 and added_lines == 0:
            change_type = "deleted"
        elif added_lines == 0 and deleted_lines == 0 and diff_segment.content.strip():
            change_type = "metadata_only"
        elif not diff_segment.content.strip():
            change_type = "no_change"

        # Filter out comment lines and blank lines for SLOC, assuming Python for simplification
        relevant_lines = [
            line for line in content_lines
            if line.strip() and not line.strip().startswith('#') and not line.strip().startswith('+') and not line.strip().startswith('-')
        ]
        sloc = len(relevant_lines)
        
        # Very crude cyclomatic complexity estimation
        cyclomatic_complexity = 1 # Base complexity
        for line in relevant_lines:
            # Look for keywords that indicate control flow changes
            if any(kw in line for kw in ["if ", "for ", "while ", "elif ", "else:", "try:", "except:", "with ", " and ", " or "]):
                cyclomatic_complexity += 1
        
        return ExportedCodeComplexityMetrics(cyclomatic_complexity=cyclomatic_complexity, sloc=sloc, change_type=change_type)


class ExpertiseProfiler:
    """
    Analyzes indexed commit data to profile author expertise over time
    and across different parts of the codebase.
    This class is exported.
    """
    def __init__(self, indexer_metadata_store: Dict[str, ExportedEnrichedCommitData]):
        self.indexer_metadata_store = indexer_metadata_store
        self.expertise_cache: Dict[str, Dict[str, float]] = {} # author -> {topic/path -> score}

    def _calculate_author_contribution_score(self, author: str, commit_data: ExportedEnrichedCommitData) -> float:
        """
        Conceptual scoring for a single commit. Can be enhanced.
        Scores based on message length, diff size, number of files changed, and complexity.
        """
        score = 0.0
        score += len(commit_data.message.split()) * 0.1

        total_diff_lines = sum(len(seg.content.split('\n')) for seg in commit_data.enriched_diffs)
        total_complexity = sum(seg.metrics.cyclomatic_complexity for seg in commit_data.enriched_diffs)
        score += total_diff_lines * 0.05
        score += total_complexity * 0.1 # More weight to complex changes

        # More recent commits could be weighted higher
        time_decay_factor = (datetime.datetime.now() - commit_data.committer_date).days / 365.0
        score *= max(0.1, 1.0 - (time_decay_factor * 0.1)) # Decay by 10% per year, min 0.1
        
        return score

    def build_expertise_profiles(self) -> None:
        """
        Iterates through all indexed commits to build or refresh expertise profiles.
        """
        print("Building author expertise profiles...")
        author_contributions: Dict[str, Dict[str, float]] = {} # author -> {path_prefix -> total_score}
        
        for commit_hash, commit_data in self.indexer_metadata_store.items():
            author = commit_data.author
            contribution_score = self._calculate_author_contribution_score(author, commit_data)

            if author not in author_contributions:
                author_contributions[author] = {}
            
            for enriched_diff_segment in commit_data.enriched_diffs:
                path_parts = enriched_diff_segment.file_path.split('/')
                path_prefix = path_parts[0] # Top-level directory
                if len(path_parts) > 1:
                    path_prefix = "/".join(path_parts[:2]) # E.g., src/api
                
                author_contributions[author][path_prefix] = author_contributions[author].get(path_prefix, 0.0) + contribution_score

        for author, topics in author_contributions.items():
            total_author_score = sum(topics.values())
            if total_author_score > 0:
                self.expertise_cache[author] = {
                    topic: score / total_author_score for topic, score in topics.items()
                }
            else:
                self.expertise_cache[author] = {}
        print("Author expertise profiles built.")

    def get_top_experts_for_path_or_topic(self, path_or_topic: str, top_n: int = 3) -> List[Tuple[str, float]]:
        """
        Retrieves top experts for a given file path or conceptual topic.
        """
        if not self.expertise_cache:
            self.build_expertise_profiles()

        candidate_experts: Dict[str, float] = {}
        for author, topics in self.expertise_cache.items():
            for topic_key, score in topics.items():
                if path_or_topic.lower() in topic_key.lower(): # Simple substring match for topic
                    candidate_experts[author] = candidate_experts.get(author, 0.0) + score
        
        sorted_experts = sorted(candidate_experts.items(), key=lambda item: item[1], reverse=True)
        return sorted_experts[:top_n]


class RepositoryHealthMonitor:
    """
    Monitors repository health by detecting anomalies in commit patterns,
    such as sudden spikes in complexity or changes.
    This class is exported.
    """
    def __init__(self, indexer_metadata_store: Dict[str, ExportedEnrichedCommitData]):
        self.indexer_metadata_store = indexer_metadata_store
        self.anomaly_threshold_std_dev = 2.0 # N standard deviations for anomaly detection

    def _get_historical_metrics_data(self, metric_key: str) -> Dict[datetime.date, List[int]]:
        """
        Aggregates historical metrics data by date.
        `metric_key` can be 'cyclomatic_complexity' or 'sloc'.
        """
        daily_metrics: Dict[datetime.date, List[int]] = {}
        for commit_data in self.indexer_metadata_store.values():
            commit_date = commit_data.author_date.date()
            if commit_date not in daily_metrics:
                daily_metrics[commit_date] = []
            
            for enriched_diff in commit_data.enriched_diffs:
                if metric_key == 'cyclomatic_complexity':
                    daily_metrics[commit_date].append(enriched_diff.metrics.cyclomatic_complexity)
                elif metric_key == 'sloc':
                    daily_metrics[commit_date].append(enriched_diff.metrics.sloc)
        return daily_metrics
    
    def detect_anomalies(self, metric_key: str = 'cyclomatic_complexity', lookback_days: int = 90) -> List[Dict[str, Any]]:
        """
        Detects commits with unusually high metric changes (e.g., complexity) within a recent period.
        """
        all_daily_metrics = self._get_historical_metrics_data(metric_key)
        
        if not all_daily_metrics:
            return []

        cutoff_date = (datetime.datetime.now() - datetime.timedelta(days=lookback_days)).date()
        recent_metrics_values = [
            metric for date, metrics_list in all_daily_metrics.items()
            if date >= cutoff_date
            for metric in metrics_list
        ]
        
        if not recent_metrics_values:
            return []
            
        mean_metric = sum(recent_metrics_values) / len(recent_metrics_values)
        std_dev_metric = (sum((x - mean_metric)**2 for x in recent_metrics_values) / len(recent_metrics_values))**0.5

        anomalies = []
        for commit_data in self.indexer_metadata_store.values():
            if commit_data.author_date.date() >= cutoff_date:
                commit_total_metric = 0
                for enriched_diff in commit_data.enriched_diffs:
                    if metric_key == 'cyclomatic_complexity':
                        commit_total_metric += enriched_diff.metrics.cyclomatic_complexity
                    elif metric_key == 'sloc':
                        commit_total_metric += enriched_diff.metrics.sloc
                
                if commit_total_metric > (mean_metric + self.anomaly_threshold_std_dev * std_dev_metric) and commit_total_metric > 0:
                    anomalies.append({
                        "commit_hash": commit_data.hash,
                        "author": commit_data.author,
                        "date": commit_data.author_date,
                        "message": commit_data.message,
                        f"total_{metric_key}_change": commit_total_metric,
                        "deviation_from_mean": commit_total_metric - mean_metric
                    })
        
        anomalies.sort(key=lambda x: x["deviation_from_mean"], reverse=True)
        return anomalies


# --- System Components Classes ---

class ArcheologySystemConfig:
    """
    Configuration parameters for the AI Git Archeology System.
    """
    def __init__(self,
                 vector_db_host: str = "localhost",
                 vector_db_port: int = 19530,
                 metadata_db_connection_string: str = "sqlite:///git_metadata.db",
                 llm_api_key: str = "YOUR_GEMINI_API_KEY",
                 embedding_model_name: str = "text-embedding-004",
                 max_context_tokens: int = 8192,
                 max_retrieved_commits: int = 20):
        self.vector_db_host = vector_db_host
        self.vector_db_port = vector_db_port
        self.metadata_db_connection_string = metadata_db_connection_string
        self.llm_api_key = llm_api_key
        self.embedding_model_name = embedding_model_name
        self.max_context_tokens = max_context_tokens
        self.max_retrieved_commits = max_retrieved_commits

class GitIndexerService:
    """
    Manages the indexing of a Git repository's history into vector and metadata stores.
    Now processes `CommitData` into `ExportedEnrichedCommitData`.
    """
    def __init__(self, config: ArcheologySystemConfig):
        self.config = config
        self.git_parser = GitRepositoryParser()
        self.vector_db_client = VectorDatabaseClient(
            host=config.vector_db_host, port=config.vector_db_port,
            collection_name="git_commits_embeddings"
        )
        self.embedding_model = SemanticEmbedding(model_name=config.embedding_model_name)
        self.complexity_analyzer = ExportedCodeComplexityAnalyzer() # Instance of new analyzer
        # Store enriched data
        self.metadata_store: Dict[str, ExportedEnrichedCommitData] = {} # Conceptual: Dict[str, ExportedEnrichedCommitData]

    def index_repository(self, repo_path: str):
        """
        Processes a Git repository, extracts commit data, generates embeddings,
        and stores them in the vector and metadata databases.
        """
        print(f"Starting indexing for repository: {repo_path}")
        self.git_parser.set_repository(repo_path)
        all_commits_data: List[CommitData] = self.git_parser.get_all_commit_data() # Returns basic CommitData

        for commit_data in all_commits_data:
            commit_hash = commit_data.hash
            
            # Enrich diff segments
            enriched_diffs: List[ExportedEnrichedDiffSegment] = []
            full_diff_text_for_embedding = []
            for original_diff in commit_data.diffs:
                metrics = self.complexity_analyzer.analyze_diff_segment(original_diff)
                enriched_diff = ExportedEnrichedDiffSegment(original_diff=original_diff, metrics=metrics)
                enriched_diffs.append(enriched_diff)
                full_diff_text_for_embedding.append(original_diff.content) # Use original content for embedding

            full_diff_text = "\n".join(full_diff_text_for_embedding)

            # Create the enriched commit data object
            enriched_commit_data = ExportedEnrichedCommitData(original_commit=commit_data,
                                                              enriched_diffs=enriched_diffs)

            # Generate embeddings for commit message
            message_embedding_vector = self.embedding_model.embed(enriched_commit_data.message)
            self.vector_db_client.insert_vector(
                vector_id=f"{commit_hash}_msg",
                vector=message_embedding_vector,
                metadata={"type": "message", "commit_hash": commit_hash}
            )

            # Generate embeddings for diff (can be chunked for larger diffs)
            if full_diff_text:
                diff_embedding_vector = self.embedding_model.embed(full_diff_text)
                self.vector_db_client.insert_vector(
                    vector_id=f"{commit_hash}_diff",
                    vector=diff_embedding_vector,
                    metadata={"type": "diff", "commit_hash": commit_hash}
                )

            # Store full enriched commit data in metadata store
            self.metadata_store[commit_hash] = enriched_commit_data
            print(f"Indexed commit: {commit_hash[:7]}")

        print(f"Finished indexing {len(all_commits_data)} commits.")

    def get_commit_metadata(self, commit_hash: str) -> Optional[ExportedEnrichedCommitData]:
        """Retrieves full enriched metadata for a given commit hash."""
        return self.metadata_store.get(commit_hash)

class ArcheologistQueryService:
    """
    Handles natural language queries, performs semantic search, and synthesizes answers.
    Now works with `ExportedEnrichedCommitData`.
    """
    def __init__(self, config: ArcheologySystemConfig, indexer: GitIndexerService):
        self.config = config
        self.indexer = indexer
        self.vector_db_client = indexer.vector_db_client # Re-use the client
        self.embedding_model = indexer.embedding_model   # Re-use the model
        self.llm_client = GeminiClient(api_key=config.llm_api_key)
        # Assuming context_builder is compatible with enriched data or just uses raw strings
        self.context_builder = LLMContextBuilder(max_tokens=config.max_context_tokens) 

    def query_repository_history(self, question: str,
                                 last_n_months: Optional[int] = None,
                                 author_filter: Optional[str] = None,
                                 path_filter: Optional[str] = None,
                                 min_complexity: Optional[int] = None # New filter
                                ) -> str:
        """
        Answers natural language questions about a git repo's history
        using semantic search and LLM synthesis.
        """
        print(f"Received query: '{question}'")

        query_vector = self.embedding_model.embed(question)

        search_results_msg = self.vector_db_client.search_vectors(
            query_vector=query_vector,
            limit=self.config.max_retrieved_commits * 2, # Fetch more to filter
            search_params={"type": "message"}
        )
        search_results_diff = self.vector_db_client.search_vectors(
            query_vector=query_vector,
            limit=self.config.max_retrieved_commits * 2,
            search_params={"type": "diff"}
        )

        relevant_commit_hashes = set()
        for res in search_results_msg + search_results_diff:
            relevant_commit_hashes.add(res.metadata["commit_hash"])

        print(f"Found {len(relevant_commit_hashes)} potentially relevant commits via vector search.")

        filtered_commits_data: List[ExportedEnrichedCommitData] = []
        for commit_hash in relevant_commit_hashes:
            commit_data = self.indexer.get_commit_metadata(commit_hash)
            if not commit_data:
                continue

            # Apply temporal filter
            if last_n_months:
                cut_off_date = datetime.datetime.now() - datetime.timedelta(days=30 * last_n_months)
                if commit_data.author_date < cut_off_date:
                    continue
            
            # Apply author filter (case-insensitive)
            if author_filter and author_filter.lower() not in commit_data.author.lower():
                continue

            # Apply path filter
            if path_filter:
                if not any(path_filter.lower() in enriched_seg.file_path.lower() for enriched_seg in commit_data.enriched_diffs):
                    continue
            
            # Apply new complexity filter
            if min_complexity is not None:
                total_commit_complexity = sum(seg.metrics.cyclomatic_complexity for seg in commit_data.enriched_diffs)
                if total_commit_complexity < min_complexity:
                    continue

            filtered_commits_data.append(commit_data)
        
        filtered_commits_data.sort(key=lambda c: c.author_date, reverse=True)
        relevant_commits_final = filtered_commits_data[:self.config.max_retrieved_commits]

        if not relevant_commits_final:
            return "I could not find any relevant commits for your query after applying filters."

        print(f"Final {len(relevant_commits_final)} commits selected for context.")

        # 4. Format the context for the AI
        # Context builder needs to be able to handle ExportedEnrichedCommitData
        # Assuming LLMContextBuilder can extract relevant strings from `enriched_commit_data`
        context_block = self.context_builder.build_context(relevant_commits_final)

        # 5. Ask the AI to synthesize the answer
        prompt = f"""
        You are an expert software archeologist and forensic engineer. Your task is to analyze
        the provided Git commit data and synthesize a precise, comprehensive answer to the user's
        question. You MUST strictly base your answer on the information presented in the commit
        context. Do not infer or invent information outside of what is explicitly provided.
        Identify key trends, principal contributors, and significant architectural or functional
        changes as directly evidenced by the commits. Pay attention to code complexity metrics if available.

        User Question: {question}

        Git Commit Data (Contextual Provenance):
        {context_block}

        Synthesized Expert Analysis and Answer:
        """

        llm_response = self.llm_client.generate_text(prompt)
        return llm_response.text

# --- Example Usage (Conceptual) ---
if __name__ == "__main__":
    # Conceptual placeholders for git_parser types
    # These would typically be imported from git_parser in a real system.
    class CommitData:
        def __init__(self, hash: str, author: str, author_email: str, author_date: datetime.datetime,
                     committer: str, committer_email: str, committer_date: datetime.datetime,
                     message: str, diffs: List['DiffSegment'], parent_hashes: List[str] = None):
            self.hash = hash
            self.author = author
            self.author_email = author_email
            self.author_date = author_date
            self.committer = committer
            self.committer_email = committer_email
            self.committer_date = committer_date
            self.message = message
            self.diffs = diffs if diffs is not None else []
            self.parent_hashes = parent_hashes if parent_hashes is not None else []

    class DiffSegment:
        def __init__(self, file_path: str, content: str):
            self.file_path = file_path
            self.content = content

    # Mocking external modules for demonstration
    class VectorDatabaseClient:
        def __init__(self, host: str, port: int, collection_name: str):
            print(f"Mock VectorDB Client initialized for {collection_name}")
            self.vectors: Dict[str, Any] = {} # vector_id -> {'vector': vector, 'metadata': metadata}

        def insert_vector(self, vector_id: str, vector: List[float], metadata: Dict[str, Any]):
            self.vectors[vector_id] = {'vector': vector, 'metadata': metadata}
            # print(f"Mock VectorDB: Inserted {vector_id}")

        def search_vectors(self, query_vector: List[float], limit: int, search_params: Dict[str, Any]) -> List[Any]:
            # Simple mock: return all, then filter by metadata type.
            # In a real DB, similarity search would happen here.
            results = []
            for vec_id, data in self.vectors.items():
                if all(data['metadata'].get(k) == v for k, v in search_params.items()):
                    # Simulate a score (e.g., higher score for closer to query_vector, here random)
                    # For demonstration, just return top N after filtering
                    results.append(type('SearchResult', (object,), {'metadata': data['metadata'], 'score': 0.8})) # Mock score
            
            # Sort by score if actual vectors were compared, here just take top N
            return results[:limit]

    class SemanticEmbedding:
        def __init__(self, model_name: str):
            print(f"Mock Embedding Model '{model_name}' loaded.")
        
        def embed(self, text: str) -> List[float]:
            # Return a dummy vector of fixed size
            return [0.1] * 768

    class LLMResponse:
        def __init__(self, text: str):
            self.text = text

    class GeminiClient:
        def __init__(self, api_key: str):
            print("Mock Gemini Client initialized.")
            self.api_key = api_key # Store for completeness

        def generate_text(self, prompt: str) -> LLMResponse:
            # Simulate LLM response based on keywords in prompt
            if "authentication" in prompt.lower() and "alex chen" in prompt.lower():
                response = "Based on the commits, Alex Chen seems to be the primary contributor to the authentication service, implementing and streamlining OAuth2 support."
            elif "payments api" in prompt.lower() and "performance regressions" in prompt.lower():
                response = "It appears Diana Wells made recent performance refinements to the payments API, optimizing currency conversion, potentially addressing earlier issues."
            elif "diana wells" in prompt.lower() and "optimize" in prompt.lower():
                response = "Diana Wells contributed to optimizing database queries for user profiles and refined currency conversion in the payments API for high throughput."
            elif "high complexity" in prompt.lower() and "recent" in prompt.lower():
                response = "One recent commit by Bob Johnson (hash d1e2f3g...) introduced new currency conversion logic to the payments API, which shows notable cyclomatic complexity."
            else:
                response = "I have synthesized an answer based on the provided commit data. Please see the context for details."
            return LLMResponse(response)

    class LLMContextBuilder:
        def __init__(self, max_tokens: int):
            self.max_tokens = max_tokens

        def build_context(self, commits: List[ExportedEnrichedCommitData]) -> str:
            context_parts = []
            for commit in commits:
                context_parts.append(f"Commit HASH: {commit.hash}")
                context_parts.append(f"Author: {commit.author} <{commit.author_email}>")
                context_parts.append(f"Date: {commit.author_date}")
                context_parts.append(f"Message:\n```\n{commit.message}\n```")
                for diff in commit.enriched_diffs:
                    context_parts.append(f"Diff Snippet (File: {diff.file_path}, Type: {diff.metrics.change_type}, CC: {diff.metrics.cyclomatic_complexity}, SLOC: {diff.metrics.sloc}):")
                    context_parts.append(f"```\n{diff.content}\n```")
                context_parts.append("---")
            
            full_context = "\n".join(context_parts)
            # Simple truncation, real context builders would prioritize important parts
            if len(full_context) > self.max_tokens * 4: # Crude token estimate
                return full_context[:self.max_tokens * 4] + "\n... [Context truncated to fit LLM window] ..."
            return full_context

    class GitRepositoryParser:
        """
        Mock Git Repository Parser to provide dummy CommitData.
        """
        def __init__(self):
            self.repo_path: Optional[str] = None
            self.dummy_data: List[CommitData] = []
            self._populate_dummy_data()

        def set_repository(self, path: str):
            self.repo_path = path
            print(f"Mock Git parser set to repo: {path}")

        def _populate_dummy_data(self):
            self.dummy_data = [
                CommitData(
                    hash="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
                    author="Alex Chen",
                    author_email="alex.chen@example.com",
                    author_date=datetime.datetime(2023, 10, 26, 10, 0, 0),
                    committer="Alex Chen",
                    committer_email="alex.chen@example.com",
                    committer_date=datetime.datetime(2023, 10, 26, 10, 0, 0),
                    message="feat: Implement new authentication service with OAuth2 support.",
                    diffs=[
                        DiffSegment(file_path="src/services/auth_service.py", content="+def authenticate_oauth2():\n    # new auth logic\n    return {'status': 'success'}\n"),
                        DiffSegment(file_path="src/api/payments_api.py", content=" # no changes here "),
                    ]
                ),
                CommitData(
                    hash="b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0",
                    author="Diana Wells",
                    author_email="diana.wells@example.com",
                    author_date=datetime.datetime(2023, 11, 15, 14, 30, 0),
                    committer="Diana Wells",
                    committer_email="diana.wells@example.com",
                    committer_date=datetime.datetime(2023, 11, 15, 14, 30, 0),
                    message="fix: Optimize database queries for user profile retrieval, reducing latency.",
                    diffs=[
                        DiffSegment(file_path="src/db/user_model.py", content="-old_query = 'SELECT * FROM users'\n+optimized_query = 'SELECT id, name FROM users WHERE active=true'\nif user_id:\n    optimized_query += f' AND id={user_id}'\nreturn execute_query(optimized_query)\n"),
                        DiffSegment(file_path="src/api/profile_api.py", content=" # updated docstring for profile endpoint "),
                    ]
                ),
                CommitData(
                    hash="c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
                    author="Alex Chen",
                    author_email="alex.chen@example.com",
                    author_date=datetime.datetime(2024, 1, 5, 9, 0, 0),
                    committer="Alex Chen",
                    committer_email="alex.chen@example.com",
                    committer_date=datetime.datetime(2024, 1, 5, 9, 0, 0),
                    message="refactor: Streamline OAuth token refreshing mechanism, improving performance under load.",
                    diffs=[
                        DiffSegment(file_path="src/services/auth_service.py", content=" # improved token refresh logic with memoization\n+token = cache.get_or_set(user_id, fetch_new_token, expiry=3600)\nif token is None:\n    token = refresh_token(user_id)\nreturn token\n"),
                        DiffSegment(file_path="src/config/security.py", content=" # minor adjustment to security headers "),
                    ]
                ),
                CommitData(
                    hash="d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0",
                    author="Bob Johnson",
                    author_email="bob.johnson@example.com",
                    author_date=datetime.datetime(2024, 2, 1, 11, 0, 0),
                    committer="Bob Johnson",
                    committer_email="bob.johnson@example.com",
                    committer_date=datetime.datetime(2024, 2, 1, 11, 0, 0),
                    message="feat: Add new currency conversion logic to payments API. Initial implementation.",
                    diffs=[
                        DiffSegment(file_path="src/api/payments_api.py", content="+def convert_currency(amount, from_curr, to_curr):\n    # complex conversion rates logic with external API call\n    if amount < 0:\n        raise ValueError('Invalid amount')\n    rate = get_rate(from_curr, to_curr)\n    if rate is None: return None\n    return amount * rate\n"),
                        DiffSegment(file_path="src/utils/currency_converter.py", content=" # new file created for helper functions "),
                    ]
                ),
                CommitData(
                    hash="e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0",
                    author="Diana Wells",
                    author_email="diana.wells@example.com",
                    author_date=datetime.datetime(2024, 2, 10, 16, 0, 0),
                    committer="Diana Wells",
                    committer_email="diana.wells@example.com",
                    committer_date=datetime.datetime(2024, 2, 10, 16, 0, 0),
                    message="perf: Refine currency conversion in payments API for high throughput.",
                    diffs=[
                        DiffSegment(file_path="src/api/payments_api.py", content=" # optimized conversion call to use local cache first\n-rate = get_rate(from_curr, to_curr)\n+rate = cached_get_rate(from_curr, to_curr)\n"),
                        DiffSegment(file_path="src/utils/currency_converter.py", content=" # caching added to currency conversion utility "),
                    ]
                )
            ]

        def get_all_commit_data(self) -> List[CommitData]:
            return self.dummy_data[:] # Return a copy


    # 1. Configuration
    system_config = ArcheologySystemConfig(
        llm_api_key="YOUR_GEMINI_API_KEY", # Replace with actual key or env var
        max_retrieved_commits=10
    )

    # 2. Initialize and Index
    git_indexer = GitIndexerService(system_config)
    
    # Simulate indexing of dummy data
    # In a real scenario, this would be `git_indexer.index_repository("/path/to/your/git/repo")`
    print("\n--- Simulating Indexing ---")
    git_indexer.git_parser.set_repository("/mock/repo") # Set mock parser's repo path
    all_raw_commits = git_indexer.git_parser.get_all_commit_data()

    for raw_commit in all_raw_commits:
        # Manually perform the enrichment and store in metadata_store
        # This bypasses the full `index_repository` for simplified setup,
        # but `index_repository` is the method to call for actual use.
        enriched_diffs_for_commit: List[ExportedEnrichedDiffSegment] = []
        full_diff_text_for_embedding_mock = []
        for original_diff_seg in raw_commit.diffs:
            metrics = git_indexer.complexity_analyzer.analyze_diff_segment(original_diff_seg)
            enriched_diff = ExportedEnrichedDiffSegment(original_diff=original_diff_seg, metrics=metrics)
            enriched_diffs_for_commit.append(enriched_diff)
            full_diff_text_for_embedding_mock.append(original_diff_seg.content)
        
        enriched_commit_data_mock = ExportedEnrichedCommitData(original_commit=raw_commit, enriched_diffs=enriched_diffs_for_commit)
        git_indexer.metadata_store[raw_commit.hash] = enriched_commit_data_mock

        # Also simulate adding embeddings (simplified)
        git_indexer.vector_db_client.insert_vector(
            vector_id=f"{raw_commit.hash}_msg",
            vector=[0.1]*768, # Placeholder vector
            metadata={"type": "message", "commit_hash": raw_commit.hash}
        )
        git_indexer.vector_db_client.insert_vector(
            vector_id=f"{raw_commit.hash}_diff",
            vector=[0.2]*768, # Placeholder vector
            metadata={"type": "diff", "commit_hash": raw_commit.hash}
        )
    print("Mock indexing complete, metadata store populated.")


    # 3. Initialize Query Service, Expertise Profiler, and Repository Health Monitor
    archeologist = ArcheologistQueryService(system_config, git_indexer)
    expertise_profiler = ExpertiseProfiler(git_indexer.metadata_store)
    health_monitor = RepositoryHealthMonitor(git_indexer.metadata_store)

    # 4. Perform Queries
    print("\n--- Query 1: Main contributors to 'authentication' service in last 6 months ---")
    query1 = "Who are the main contributors to the 'authentication' service in the last 6 months?"
    answer1 = archeologist.query_repository_history(query1, last_n_months=6, path_filter="auth_service.py")
    print(f"Answer: {answer1}")

    print("\n--- Query 2: Commit that introduced performance regressions in payments API recently (high complexity) ---")
    query2 = "Find the commit that introduced performance regressions in the payments API recently, focusing on complex changes."
    answer2 = archeologist.query_repository_history(query2, last_n_months=3, path_filter="payments_api.py", min_complexity=5)
    print(f"Answer: {answer2}")

    print("\n--- Query 3: What changes did Diana Wells make to optimize the system? ---")
    query3 = "What changes did Diana Wells make to optimize the system?"
    answer3 = archeologist.query_repository_history(query3, author_filter="Diana Wells")
    print(f"Answer: {answer3}")

    # 5. Demonstrate new features
    print("\n--- Expertise Profiler: Top experts for 'api' module ---")
    top_api_experts = expertise_profiler.get_top_experts_for_path_or_topic("api", top_n=2)
    print(f"Top API Experts: {top_api_experts}")

    print("\n--- Repository Health Monitor: Recent complexity anomalies ---")
    complexity_anomalies = health_monitor.detect_anomalies(metric_key='cyclomatic_complexity', lookback_days=90)
    print(f"Recent Complexity Anomalies: {complexity_anomalies}")

    print("\n--- Repository Health Monitor: Recent SLOC anomalies ---")
    sloc_anomalies = health_monitor.detect_anomalies(metric_key='sloc', lookback_days=90)
    print(f"Recent SLOC Anomalies: {sloc_anomalies}")

```

**Title of Invention:** System and Method for Semantic-Cognitive Archeology of Distributed Version Control Systems

**Abstract:**
A profoundly innovative system and associated methodologies are unveiled for the forensic, semantic-cognitive analysis of distributed version control systems (DVCS), exemplified by Git repositories. This invention meticulously indexes the entirety of a repository's historical provenance, encompassing granular details such as cryptographic commit identifiers, authorial attribution, temporal markers, comprehensive commit messages, and the atomic transformations codified within diffs. A sophisticated, intuitive natural language interface empowers users to articulate complex queries (e.g., "Discern the commit antecedent to the observed stochastic latency increase within the critical payment processing sub-system API circa Q3 fiscal year 2023"). The core of this system leverages advanced large language models (LLMs) to orchestrate a hyper-dimensional semantic retrieval over the meticulously indexed commit data and their associated code modifications. This process identifies the most epistemologically relevant commits, which are then synthetically analyzed by the LLM to construct and articulate a direct, contextually rich, and actionable response to the user's initial inquiry.

**Background of the Invention:**
The contemporary landscape of software engineering is characterized by colossal, intricately version-controlled software repositories, often spanning millions of lines of source code and accumulating hundreds of thousands, if not millions, of individual commits over extended temporal horizons. Within these digital archives, the provenance of defects, the identification of domain-specific subject matter experts, and the elucidation of feature evolutionary trajectories are tasks that invariably demand prohibitive investments in manual effort. This traditional approach typically involves painstaking manual textual inspection, rudimentary keyword-based log parsing, and exhaustive diff comparison. Prior art solutions, predominantly reliant on lexical string matching and regular expression patterns, are inherently constrained by their lack of genuine semantic comprehension. They fail to encapsulate the conceptual relationships between terms, the intent behind code modifications, or the higher-order structural evolution of software artifacts. Consequently, these methods are demonstrably inadequate for navigating the profound conceptual complexity embedded within large-scale software development histories, necessitating a paradigm shift towards intelligent, semantic-aware analytical frameworks.

**Brief Summary of the Invention:**
The present invention introduces the conceptualization and operationalization of an "AI Git Archeologist" â€“ a revolutionary, intelligent agent for the deep semantic excavation of software histories. This system establishes a high-bandwidth, bi-directional interface with a target Git repository, initiating a rigorous indexing and transformation pipeline. This pipeline involves the generation of high-fidelity vector embeddings for every salient textual and structural element within the commit history, specifically commit messages and comprehensive code diffs, and their subsequent persistence within a specialized vector database. The system then provides an intuitively accessible natural language querying interface, enabling a developer to pose complex questions in idiomatic English. Upon receiving such a query, the system orchestrates a multi-modal, contextually aware retrieval operation, identifying the most epistemically relevant commits. These retrieved commits, alongside their associated metadata and content, are then dynamically compiled into a rich contextual payload. This payload is subsequently transmitted to a highly sophisticated generative artificial intelligence model. The AI model is meticulously prompted to assume the persona of an expert software forensic engineer, tasked with synthesizing a precise, insightful, and comprehensive answer to the developer's original question, leveraging solely the provided commit provenance data. This methodology represents a quantum leap in the interpretability and navigability of software development histories.

**Detailed Description of the Invention:**

The architecture of the Semantic-Cognitive Archeology System for Distributed Version Control Systems comprises several interconnected and rigorously engineered modules, designed to operate synergistically to achieve unprecedented levels of historical code comprehension.

### System Architecture Overview

The system operates in two primary phases: an **Indexing Phase** and a **Query Phase**.

<details>
<summary>Architectural Data Flow Diagram (Mermaid)</summary>

```mermaid
graph TD
    subgraph "Indexing Phase: Historical Data Ingestion & Transformation"
        A[Git Repository] --> B[Commit Stream Extractor]
        B --> C{Commit Data Parser}
        C --> D[Diff Analyzer & Code Element Extractor]
        C --> E[Message & Metadata Extractor]
        D --> F[Semantic Encoder: Diff Embeddings]
        E --> G[Semantic Encoder: Message Embeddings]
        F --> H[Vector Database Inserter]
        G --> H
        C --> I[Relational/Document DB Inserter]
        H --> J[Vector Database]
        I --> K[Metadata Store]
        J --> L[Indexed Repository State]
        K --> L
    end

    subgraph "Query Phase: Semantic Retrieval & Syntactic Synthesis"
        M[User Query (Natural Language)] --> N[Query Semantic Encoder]
        N --> O[Vector Database Query Engine]
        O --> P{Relevant Commit & Diff Embeddings}
        P --> Q[Context Assembler]
        Q --> R[Metadata Store Lookup]
        R --> Q
        Q --> S[Generative AI Model Orchestrator]
        S --> T[Large Language Model (LLM)]
        T --> S
        S --> U[Synthesized Answer]
        U --> V[User Interface]
    end

    L --> O
    L --> R
```
</details>

### The Indexing Phase: Construction of the Epistemological Graph

The initial and foundational phase involves the systematic ingestion, parsing, and transformation of the target Git repository's entire historical lineage into a machine-comprehensible, semantically rich representation.

1.  **Repository Synchronization and Commit Stream Extraction:**
    The system initiates by cloning or updating the target Git repository. A `CommitStreamExtractor` module then iterates through the complete history, typically in a reverse chronological order, leveraging Git's native plumbing commands (e.g., `git log --pretty=format:%H --topo-order`). Each commit object, uniquely identified by its SHA-1 hash (or equivalent cryptographic identifier), is systematically processed.

2.  **Commit Data Parsing and Normalization:**
    For each commit, the `CommitDataParser` extracts fundamental metadata:
    *   **Commit Hash (`H`):** The immutable cryptographic identifier.
    *   **Author (`A`):** Name and email of the commit's originator.
    *   **Committer (`C`):** Name and email of the entity who applied the commit (can differ from author).
    *   **Author Date (`AD`):** The timestamp when the commit was originally authored.
    *   **Committer Date (`CD`):** The timestamp when the commit was applied to the repository.
    *   **Parent Hashes (`P_H`):** References to the direct ancestor commits, crucial for graph traversal and merge analysis.
    *   **Commit Message (`M`):** The descriptive text provided by the author.

3.  **Diff Analysis and Code Element Extraction:**
    The `DiffAnalyzer` module is responsible for processing the `git diff` output for each commit (or `git show <hash>`). This yields a canonical representation of all changes introduced or removed by the commit. For each file modification within a diff, the system extracts:
    *   **File Path (`FP`):** The path of the modified file (both old and new paths for renames).
    *   **Change Type (`CT`):** Addition, modification, deletion, rename.
    *   **Line-level Changes (`LC`):** The actual added, deleted, or modified lines of code.
    *   **Structural Elements (`SE`):** Utilizing Abstract Syntax Tree (AST) parsers (language-specific), the system can optionally extract more granular code changes, such as function signature modifications, class additions, variable declarations, and dependency changes. This provides a structural context beyond mere text.

4.  **Semantic Encoding (Vector Embedding Generation):**
    This is a critical step where raw textual and code data are transformed into high-dimensional numerical vector embeddings, capturing their semantic meaning.
    *   **Commit Message Embeddings (`E_M`):** The `CommitMessageEncoder` processes the commit message (`M`) using a pre-trained transformer-based language model (e.g., Sentence-BERT, OpenAI's embedding models). The output is a dense vector `v_M` that semantically represents the message's intent and content.
    *   **Code Diff Embeddings (`E_D`):** The `CodeDiffEncoder` processes the concatenated line-level changes (`LC`) and optionally the extracted `Structural Elements` (`SE`). Due to the potentially large size of diffs, chunking, summarization, or specialized code-aware embedding models (e.g., CodeBERT, GraphCodeBERT) may be employed to generate a vector `v_D` for the entire diff or a set of vectors for individual changed files/functions.
    *   **Author & Path Embeddings (`E_A`, `E_P` - Optional):** Authors and file paths can also be embedded to capture "expertise proximity" or "topical area proximity" respectively.

5.  **Data Persistence: Vector Database and Metadata Store:**
    The generated embeddings and parsed metadata are stored in optimized databases:
    *   **Vector Database (`J`):** A specialized database (e.g., Milvus, Pinecone, Weaviate, FAISS) designed for efficient Approximate Nearest Neighbor (ANN) search in high-dimensional spaces. Each commit hash `H` is associated with its `v_M` and `v_D` vectors.
    *   **Metadata Store (`K`):** A relational or document database (e.g., PostgreSQL, MongoDB) that stores all extracted non-vector metadata (author, dates, parent hashes, original commit messages, original diffs, file paths, etc.). This store allows for rapid attribute-based filtering and retrieval of the original content corresponding to a matched vector.

### The Query Phase: Semantic Retrieval and Cognitive Synthesis

This phase leverages the indexed data to answer complex natural language queries.

1.  **User Query Ingestion and Semantic Encoding:**
    A user submits a natural language query `q` (e.g., "Who touched the security module last quarter?"). The `QuerySemanticEncoder` module processes `q` using the *same* embedding model employed for commit messages, generating a query embedding `v_q`.

2.  **Multi-Modal Semantic Search:**
    The `VectorDatabaseQueryEngine` performs a sophisticated search operation:
    *   **Primary Vector Search:** It queries the `Vector Database` using `v_q` to find the top `K` most semantically similar commit message embeddings (`v_M`) and optionally diff embeddings (`v_D`). This yields a preliminary set of candidate commit hashes.
    *   **Filtering and Refinement:** Concurrently or sequentially, metadata filters (e.g., `last_n_months`, `author_name`, `file_path_regex`) are applied to narrow down the search space or re-rank results. For instance, a query involving a temporal constraint will filter commits by `Committer Date`.
    *   **Relevance Scoring:** A composite relevance score `S_R` might be calculated, combining cosine similarity scores from message and diff embeddings, weighted by recency, author relevance, or file path relevance.

3.  **Context Assembly:**
    The `ContextAssembler` retrieves the full metadata and original content (commit message, diff text) for the top `N` most relevant commits from the `Metadata Store`. This data is then meticulously formatted into a coherent, structured textual block optimized for LLM consumption.
    Example Structure:
    ```
    Commit HASH: [commit_hash]
    Author: [author_name] <[author_email]>
    Date: [commit_date]
    Message:
    ```
    ```
    [commit_message_text]
    ```
    ```
    Diff Snippet (File: [file_path]):
    ```
    ```
    [relevant_diff_lines]
    ```
    ```
    ---
    ```
    This process may involve intelligent truncation or summarization of excessively large diffs to fit within the LLM's token context window, while preserving the most semantically pertinent parts.

4.  **Generative AI Model Orchestration and Synthesis:**
    The formatted context block, along with the original user query, is transmitted to the `GenerativeAIModelOrchestrator`. This module constructs a meticulously engineered prompt for the `LargeLanguageModel (LLM)`.

    **Example Prompt Structure:**
    ```
    You are an expert software archeologist and forensic engineer. Your task is to analyze a provided set of Git commit histories and synthesize a precise, comprehensive answer to the user's question, strictly based on the provided data. Do not infer or invent information outside of what is explicitly presented in the commit context. Identify key trends, contributors, and significant changes.

    User Question: {original_user_question}

    Git Commit Data (Contextual Provenance):
    {assembled_context_block}

    Synthesized Expert Analysis and Answer:
    ```

    The `LLM` (e.g., Gemini, GPT-4) then processes this prompt. It performs an intricate cognitive analysis, identifying patterns, extracting entities (e.g., authors, file paths, specific code changes), correlating information across multiple commits, and synthesizing a coherent, natural language answer.

5.  **Answer Display:**
    The `Synthesized Answer` from the LLM is then presented to the user via an intuitive `User Interface`, often enriched with direct links back to the original commits in the source repository for verification.

### Advanced Features and Extensions

The fundamental framework can be extended with sophisticated functionalities:

*   **Temporal Anomaly Detection:** Identifying commits that deviate significantly from historical patterns in terms of size, author activity, or file modification frequency, potentially signaling regressions or security concerns.
*   **Author Expertise Mapping:** Building a dynamic profile of author expertise based on their contributions to specific modules, files, or semantic topics, aiding in identifying SMEs.
*   **Code Ownership Inference:** Automatically inferring granular code ownership at the file, directory, or even function level based on commit history and contribution weights.
*   **Regression Analysis:** Identifying potential root causes of reported bugs by semantically linking bug reports to relevant code changes and using the LLM to hypothesize causal relationships.
*   **Cross-Repository Archeology:** Extending the indexing and querying capabilities across multiple interconnected repositories within an organization.
*   **Interactive Refinement:** Allowing users to provide feedback on initial results, triggering iterative semantic searches or context re-assembly.

### Conceptual Code (Python Backend)

The following conceptual Python code illustrates the interaction between the described modules. It outlines the core logic, assuming the existence of robust `vector_db` and `gemini_client` integrations.

```python
import datetime
from typing import List, Dict, Any, Optional, Tuple

# Assume these are well-defined external modules or interfaces
from vector_db import VectorDatabaseClient, SemanticEmbedding
from gemini_client import GeminiClient, LLMResponse
from git_parser import GitRepositoryParser, CommitData, DiffSegment
from context_builder import LLMContextBuilder

# --- New Exported Classes and Components ---

class ExportedCodeComplexityMetrics:
    """
    Stores code complexity metrics for a diff segment or code block.
    This class is exported.
    """
    def __init__(self, cyclomatic_complexity: int = 0, sloc: int = 0, change_type: str = "modified"):
        self.cyclomatic_complexity = cyclomatic_complexity
        self.sloc = sloc
        self.change_type = change_type

    def to_dict(self) -> Dict[str, Any]:
        return {
            "cyclomatic_complexity": self.cyclomatic_complexity,
            "sloc": self.sloc,
            "change_type": self.change_type
        }
    
    def __repr__(self):
        return f"ExportedCodeComplexityMetrics(cc={self.cyclomatic_complexity}, sloc={self.sloc}, type='{self.change_type}')"


class ExportedEnrichedDiffSegment:
    """
    Wraps an original `DiffSegment` from `git_parser` and extends it with computed code complexity metrics.
    This class is exported.
    """
    def __init__(self, original_diff: DiffSegment, metrics: Optional[ExportedCodeComplexityMetrics] = None):
        self.original_diff = original_diff
        self.metrics = metrics if metrics is not None else ExportedCodeComplexityMetrics()
    
    @property
    def file_path(self) -> str:
        return self.original_diff.file_path
    
    @property
    def content(self) -> str:
        return self.original_diff.content
    
    def to_dict(self) -> Dict[str, Any]:
        base_dict = {"file_path": self.file_path, "content": self.content}
        if self.metrics:
            base_dict["metrics"] = self.metrics.to_dict()
        return base_dict

    def __repr__(self):
        return f"ExportedEnrichedDiffSegment(file_path='{self.file_path}', metrics={self.metrics})"


class ExportedEnrichedCommitData:
    """
    Stores comprehensive data for a single Git commit, including enriched diffs.
    Wraps the `CommitData` from `git_parser`.
    This class is exported.
    """
    def __init__(self, original_commit: CommitData,
                 enriched_diffs: List[ExportedEnrichedDiffSegment]):
        self.original_commit = original_commit
        self.enriched_diffs = enriched_diffs
    
    # Delegate properties to the original commit for convenience
    @property
    def hash(self) -> str: return self.original_commit.hash
    @property
    def author(self) -> str: return self.original_commit.author
    @property
    def author_email(self) -> str: return self.original_commit.author_email
    @property
    def author_date(self) -> datetime.datetime: return self.original_commit.author_date
    @property
    def committer(self) -> str: return self.original_commit.committer
    @property
    def committer_email(self) -> str: return self.original_commit.committer_email
    @property
    def committer_date(self) -> datetime.datetime: return self.original_commit.committer_date
    @property
    def message(self) -> str: return self.original_commit.message
    @property
    def parent_hashes(self) -> List[str]: return self.original_commit.parent_hashes
    
    # Original diffs for backward compatibility if needed by other modules
    @property
    def diffs(self) -> List[DiffSegment]: return self.original_commit.diffs

    def __repr__(self):
        return f"ExportedEnrichedCommitData(hash='{self.hash[:7]}', author='{self.author}', date='{self.author_date.date()}')"


class ExportedCodeComplexityAnalyzer:
    """
    Analyzes code diff segments to extract complexity metrics.
    Conceptual implementation, actual static analysis tools would be used.
    This class is exported.
    """
    def analyze_diff_segment(self, diff_segment: DiffSegment) -> ExportedCodeComplexityMetrics:
        """
        Analyzes a single `git_parser.DiffSegment` for complexity.
        This is a placeholder for actual static analysis tools.
        """
        content_lines = diff_segment.content.split('\n')
        
        change_type = "modified"
        added_lines = sum(1 for line in content_lines if line.startswith('+'))
        deleted_lines = sum(1 for line in content_lines if line.startswith('-'))
        if added_lines > 0 and deleted_lines == 0:
            change_type = "added"
        elif deleted_lines > 0 and added_lines == 0:
            change_type = "deleted"
        elif added_lines == 0 and deleted_lines == 0 and diff_segment.content.strip():
            change_type = "metadata_only"
        elif not diff_segment.content.strip():
            change_type = "no_change"

        # Filter out comment lines and blank lines for SLOC, assuming Python for simplification
        relevant_lines = [
            line for line in content_lines
            if line.strip() and not line.strip().startswith('#') and not line.strip().startswith('+') and not line.strip().startswith('-')
        ]
        sloc = len(relevant_lines)
        
        # Very crude cyclomatic complexity estimation
        cyclomatic_complexity = 1 # Base complexity
        for line in relevant_lines:
            # Look for keywords that indicate control flow changes
            if any(kw in line for kw in ["if ", "for ", "while ", "elif ", "else:", "try:", "except:", "with ", " and ", " or "]):
                cyclomatic_complexity += 1
        
        return ExportedCodeComplexityMetrics(cyclomatic_complexity=cyclomatic_complexity, sloc=sloc, change_type=change_type)


class ExpertiseProfiler:
    """
    Analyzes indexed commit data to profile author expertise over time
    and across different parts of the codebase.
    This class is exported.
    """
    def __init__(self, indexer_metadata_store: Dict[str, ExportedEnrichedCommitData]):
        self.indexer_metadata_store = indexer_metadata_store
        self.expertise_cache: Dict[str, Dict[str, float]] = {} # author -> {topic/path -> score}

    def _calculate_author_contribution_score(self, author: str, commit_data: ExportedEnrichedCommitData) -> float:
        """
        Conceptual scoring for a single commit. Can be enhanced.
        Scores based on message length, diff size, number of files changed, and complexity.
        """
        score = 0.0
        score += len(commit_data.message.split()) * 0.1

        total_diff_lines = sum(len(seg.content.split('\n')) for seg in commit_data.enriched_diffs)
        total_complexity = sum(seg.metrics.cyclomatic_complexity for seg in commit_data.enriched_diffs)
        score += total_diff_lines * 0.05
        score += total_complexity * 0.1 # More weight to complex changes

        # More recent commits could be weighted higher
        time_decay_factor = (datetime.datetime.now() - commit_data.committer_date).days / 365.0
        score *= max(0.1, 1.0 - (time_decay_factor * 0.1)) # Decay by 10% per year, min 0.1
        
        return score

    def build_expertise_profiles(self) -> None:
        """
        Iterates through all indexed commits to build or refresh expertise profiles.
        """
        print("Building author expertise profiles...")
        author_contributions: Dict[str, Dict[str, float]] = {} # author -> {path_prefix -> total_score}
        
        for commit_hash, commit_data in self.indexer_metadata_store.items():
            author = commit_data.author
            contribution_score = self._calculate_author_contribution_score(author, commit_data)

            if author not in author_contributions:
                author_contributions[author] = {}
            
            for enriched_diff_segment in commit_data.enriched_diffs:
                path_parts = enriched_diff_segment.file_path.split('/')
                path_prefix = path_parts[0] # Top-level directory
                if len(path_parts) > 1:
                    path_prefix = "/".join(path_parts[:2]) # E.g., src/api
                
                author_contributions[author][path_prefix] = author_contributions[author].get(path_prefix, 0.0) + contribution_score

        for author, topics in author_contributions.items():
            total_author_score = sum(topics.values())
            if total_author_score > 0:
                self.expertise_cache[author] = {
                    topic: score / total_author_score for topic, score in topics.items()
                }
            else:
                self.expertise_cache[author] = {}
        print("Author expertise profiles built.")

    def get_top_experts_for_path_or_topic(self, path_or_topic: str, top_n: int = 3) -> List[Tuple[str, float]]:
        """
        Retrieves top experts for a given file path or conceptual topic.
        """
        if not self.expertise_cache:
            self.build_expertise_profiles()

        candidate_experts: Dict[str, float] = {}
        for author, topics in self.expertise_cache.items():
            for topic_key, score in topics.items():
                if path_or_topic.lower() in topic_key.lower(): # Simple substring match for topic
                    candidate_experts[author] = candidate_experts.get(author, 0.0) + score
        
        sorted_experts = sorted(candidate_experts.items(), key=lambda item: item[1], reverse=True)
        return sorted_experts[:top_n]


class RepositoryHealthMonitor:
    """
    Monitors repository health by detecting anomalies in commit patterns,
    such as sudden spikes in complexity or changes.
    This class is exported.
    """
    def __init__(self, indexer_metadata_store: Dict[str, ExportedEnrichedCommitData]):
        self.indexer_metadata_store = indexer_metadata_store
        self.anomaly_threshold_std_dev = 2.0 # N standard deviations for anomaly detection

    def _get_historical_metrics_data(self, metric_key: str) -> Dict[datetime.date, List[int]]:
        """
        Aggregates historical metrics data by date.
        `metric_key` can be 'cyclomatic_complexity' or 'sloc'.
        """
        daily_metrics: Dict[datetime.date, List[int]] = {}
        for commit_data in self.indexer_metadata_store.values():
            commit_date = commit_data.author_date.date()
            if commit_date not in daily_metrics:
                daily_metrics[commit_date] = []
            
            for enriched_diff in commit_data.enriched_diffs:
                if metric_key == 'cyclomatic_complexity':
                    daily_metrics[commit_date].append(enriched_diff.metrics.cyclomatic_complexity)
                elif metric_key == 'sloc':
                    daily_metrics[commit_date].append(enriched_diff.metrics.sloc)
        return daily_metrics
    
    def detect_anomalies(self, metric_key: str = 'cyclomatic_complexity', lookback_days: int = 90) -> List[Dict[str, Any]]:
        """
        Detects commits with unusually high metric changes (e.g., complexity) within a recent period.
        """
        all_daily_metrics = self._get_historical_metrics_data(metric_key)
        
        if not all_daily_metrics:
            return []

        cutoff_date = (datetime.datetime.now() - datetime.timedelta(days=lookback_days)).date()
        recent_metrics_values = [
            metric for date, metrics_list in all_daily_metrics.items()
            if date >= cutoff_date
            for metric in metrics_list
        ]
        
        if not recent_metrics_values:
            return []
            
        mean_metric = sum(recent_metrics_values) / len(recent_metrics_values)
        std_dev_metric = (sum((x - mean_metric)**2 for x in recent_metrics_values) / len(recent_metrics_values))**0.5

        anomalies = []
        for commit_data in self.indexer_metadata_store.values():
            if commit_data.author_date.date() >= cutoff_date:
                commit_total_metric = 0
                for enriched_diff in commit_data.enriched_diffs:
                    if metric_key == 'cyclomatic_complexity':
                        commit_total_metric += enriched_diff.metrics.cyclomatic_complexity
                    elif metric_key == 'sloc':
                        commit_total_metric += enriched_diff.metrics.sloc
                
                if commit_total_metric > (mean_metric + self.anomaly_threshold_std_dev * std_dev_metric) and commit_total_metric > 0:
                    anomalies.append({
                        "commit_hash": commit_data.hash,
                        "author": commit_data.author,
                        "date": commit_data.author_date,
                        "message": commit_data.message,
                        f"total_{metric_key}_change": commit_total_metric,
                        "deviation_from_mean": commit_total_metric - mean_metric
                    })
        
        anomalies.sort(key=lambda x: x["deviation_from_mean"], reverse=True)
        return anomalies


# --- System Components Classes ---

class ArcheologySystemConfig:
    """
    Configuration parameters for the AI Git Archeology System.
    """
    def __init__(self,
                 vector_db_host: str = "localhost",
                 vector_db_port: int = 19530,
                 metadata_db_connection_string: str = "sqlite:///git_metadata.db",
                 llm_api_key: str = "YOUR_GEMINI_API_KEY",
                 embedding_model_name: str = "text-embedding-004",
                 max_context_tokens: int = 8192,
                 max_retrieved_commits: int = 20):
        self.vector_db_host = vector_db_host
        self.vector_db_port = vector_db_port
        self.metadata_db_connection_string = metadata_db_connection_string
        self.llm_api_key = llm_api_key
        self.embedding_model_name = embedding_model_name
        self.max_context_tokens = max_context_tokens
        self.max_retrieved_commits = max_retrieved_commits

class GitIndexerService:
    """
    Manages the indexing of a Git repository's history into vector and metadata stores.
    Now processes `CommitData` into `ExportedEnrichedCommitData`.
    """
    def __init__(self, config: ArcheologySystemConfig):
        self.config = config
        self.git_parser = GitRepositoryParser()
        self.vector_db_client = VectorDatabaseClient(
            host=config.vector_db_host, port=config.vector_db_port,
            collection_name="git_commits_embeddings"
        )
        self.embedding_model = SemanticEmbedding(model_name=config.embedding_model_name)
        self.complexity_analyzer = ExportedCodeComplexityAnalyzer() # Instance of new analyzer
        # Store enriched data
        self.metadata_store: Dict[str, ExportedEnrichedCommitData] = {} # Conceptual: Dict[str, ExportedEnrichedCommitData]

    def index_repository(self, repo_path: str):
        """
        Processes a Git repository, extracts commit data, generates embeddings,
        and stores them in the vector and metadata databases.
        """
        print(f"Starting indexing for repository: {repo_path}")
        self.git_parser.set_repository(repo_path)
        all_commits_data: List[CommitData] = self.git_parser.get_all_commit_data() # Returns basic CommitData

        for commit_data in all_commits_data:
            commit_hash = commit_data.hash
            
            # Enrich diff segments
            enriched_diffs: List[ExportedEnrichedDiffSegment] = []
            full_diff_text_for_embedding = []
            for original_diff in commit_data.diffs:
                metrics = self.complexity_analyzer.analyze_diff_segment(original_diff)
                enriched_diff = ExportedEnrichedDiffSegment(original_diff=original_diff, metrics=metrics)
                enriched_diffs.append(enriched_diff)
                full_diff_text_for_embedding.append(original_diff.content) # Use original content for embedding

            full_diff_text = "\n".join(full_diff_text_for_embedding)

            # Create the enriched commit data object
            enriched_commit_data = ExportedEnrichedCommitData(original_commit=commit_data,
                                                              enriched_diffs=enriched_diffs)

            # Generate embeddings for commit message
            message_embedding_vector = self.embedding_model.embed(enriched_commit_data.message)
            self.vector_db_client.insert_vector(
                vector_id=f"{commit_hash}_msg",
                vector=message_embedding_vector,
                metadata={"type": "message", "commit_hash": commit_hash}
            )

            # Generate embeddings for diff (can be chunked for larger diffs)
            if full_diff_text:
                diff_embedding_vector = self.embedding_model.embed(full_diff_text)
                self.vector_db_client.insert_vector(
                    vector_id=f"{commit_hash}_diff",
                    vector=diff_embedding_vector,
                    metadata={"type": "diff", "commit_hash": commit_hash}
                )

            # Store full enriched commit data in metadata store
            self.metadata_store[commit_hash] = enriched_commit_data
            print(f"Indexed commit: {commit_hash[:7]}")

        print(f"Finished indexing {len(all_commits_data)} commits.")

    def get_commit_metadata(self, commit_hash: str) -> Optional[ExportedEnrichedCommitData]:
        """Retrieves full enriched metadata for a given commit hash."""
        return self.metadata_store.get(commit_hash)

class ArcheologistQueryService:
    """
    Handles natural language queries, performs semantic search, and synthesizes answers.
    Now works with `ExportedEnrichedCommitData`.
    """
    def __init__(self, config: ArcheologySystemConfig, indexer: GitIndexerService):
        self.config = config
        self.indexer = indexer
        self.vector_db_client = indexer.vector_db_client # Re-use the client
        self.embedding_model = indexer.embedding_model   # Re-use the model
        self.llm_client = GeminiClient(api_key=config.llm_api_key)
        # Assuming context_builder is compatible with enriched data or just uses raw strings
        self.context_builder = LLMContextBuilder(max_tokens=config.max_context_tokens) 

    def query_repository_history(self, question: str,
                                 last_n_months: Optional[int] = None,
                                 author_filter: Optional[str] = None,
                                 path_filter: Optional[str] = None,
                                 min_complexity: Optional[int] = None # New filter
                                ) -> str:
        """
        Answers natural language questions about a git repo's history
        using semantic search and LLM synthesis.
        """
        print(f"Received query: '{question}'")

        query_vector = self.embedding_model.embed(question)

        search_results_msg = self.vector_db_client.search_vectors(
            query_vector=query_vector,
            limit=self.config.max_retrieved_commits * 2, # Fetch more to filter
            search_params={"type": "message"}
        )
        search_results_diff = self.vector_db_client.search_vectors(
            query_vector=query_vector,
            limit=self.config.max_retrieved_commits * 2,
            search_params={"type": "diff"}
        )

        relevant_commit_hashes = set()
        for res in search_results_msg + search_results_diff:
            relevant_commit_hashes.add(res.metadata["commit_hash"])

        print(f"Found {len(relevant_commit_hashes)} potentially relevant commits via vector search.")

        filtered_commits_data: List[ExportedEnrichedCommitData] = []
        for commit_hash in relevant_commit_hashes:
            commit_data = self.indexer.get_commit_metadata(commit_hash)
            if not commit_data:
                continue

            # Apply temporal filter
            if last_n_months:
                cut_off_date = datetime.datetime.now() - datetime.timedelta(days=30 * last_n_months)
                if commit_data.author_date < cut_off_date:
                    continue
            
            # Apply author filter (case-insensitive)
            if author_filter and author_filter.lower() not in commit_data.author.lower():
                continue

            # Apply path filter
            if path_filter:
                if not any(path_filter.lower() in enriched_seg.file_path.lower() for enriched_seg in commit_data.enriched_diffs):
                    continue
            
            # Apply new complexity filter
            if min_complexity is not None:
                total_commit_complexity = sum(seg.metrics.cyclomatic_complexity for seg in commit_data.enriched_diffs)
                if total_commit_complexity < min_complexity:
                    continue

            filtered_commits_data.append(commit_data)
        
        filtered_commits_data.sort(key=lambda c: c.author_date, reverse=True)
        relevant_commits_final = filtered_commits_data[:self.config.max_retrieved_commits]

        if not relevant_commits_final:
            return "I could not find any relevant commits for your query after applying filters."

        print(f"Final {len(relevant_commits_final)} commits selected for context.")

        # 4. Format the context for the AI
        # Context builder needs to be able to handle ExportedEnrichedCommitData
        # Assuming LLMContextBuilder can extract relevant strings from `enriched_commit_data`
        context_block = self.context_builder.build_context(relevant_commits_final)

        # 5. Ask the AI to synthesize the answer
        prompt = f"""
        You are an expert software archeologist and forensic engineer. Your task is to analyze
        the provided Git commit data and synthesize a precise, comprehensive answer to the user's
        question. You MUST strictly base your answer on the information presented in the commit
        context. Do not infer or invent information outside of what is explicitly provided.
        Identify key trends, principal contributors, and significant architectural or functional
        changes as directly evidenced by the commits. Pay attention to code complexity metrics if available.

        User Question: {question}

        Git Commit Data (Contextual Provenance):
        {context_block}

        Synthesized Expert Analysis and Answer:
        """

        llm_response = self.llm_client.generate_text(prompt)
        return llm_response.text

# --- Example Usage (Conceptual) ---
# if __name__ == "__main__":
#     # Conceptual placeholders for git_parser types
#     # These would typically be imported from git_parser in a real system.
#     class CommitData:
#         def __init__(self, hash: str, author: str, author_email: str, author_date: datetime.datetime,
#                      committer: str, committer_email: str, committer_date: datetime.datetime,
#                      message: str, diffs: List['DiffSegment'], parent_hashes: List[str] = None):
#             self.hash = hash
#             self.author = author
#             self.author_email = author_email
#             self.author_date = author_date
#             self.committer = committer
#             self.committer_email = committer_email
#             self.committer_date = committer_date
#             self.message = message
#             self.diffs = diffs if diffs is not None else []
#             self.parent_hashes = parent_hashes if parent_hashes is not None else []

#     class DiffSegment:
#         def __init__(self, file_path: str, content: str):
#             self.file_path = file_path
#             self.content = content

#     # Mocking external modules for demonstration
#     class VectorDatabaseClient:
#         def __init__(self, host: str, port: int, collection_name: str):
#             print(f"Mock VectorDB Client initialized for {collection_name}")
#             self.vectors: Dict[str, Any] = {} # vector_id -> {'vector': vector, 'metadata': metadata}

#         def insert_vector(self, vector_id: str, vector: List[float], metadata: Dict[str, Any]):
#             self.vectors[vector_id] = {'vector': vector, 'metadata': metadata}
#             # print(f"Mock VectorDB: Inserted {vector_id}")

#         def search_vectors(self, query_vector: List[float], limit: int, search_params: Dict[str, Any]) -> List[Any]:
#             # Simple mock: return all, then filter by metadata type.
#             # In a real DB, similarity search would happen here.
#             results = []
#             for vec_id, data in self.vectors.items():
#                 if all(data['metadata'].get(k) == v for k, v in search_params.items()):
#                     # Simulate a score (e.g., higher score for closer to query_vector, here random)
#                     # For demonstration, just return top N after filtering
#                     results.append(type('SearchResult', (object,), {'metadata': data['metadata'], 'score': 0.8})) # Mock score
            
#             # Sort by score if actual vectors were compared, here just take top N
#             return results[:limit]

#     class SemanticEmbedding:
#         def __init__(self, model_name: str):
#             print(f"Mock Embedding Model '{model_name}' loaded.")
        
#         def embed(self, text: str) -> List[float]:
#             # Return a dummy vector of fixed size
#             return [0.1] * 768

#     class LLMResponse:
#         def __init__(self, text: str):
#             self.text = text

#     class GeminiClient:
#         def __init__(self, api_key: str):
#             print("Mock Gemini Client initialized.")
#             self.api_key = api_key # Store for completeness

#         def generate_text(self, prompt: str) -> LLMResponse:
#             # Simulate LLM response based on keywords in prompt
#             if "authentication" in prompt.lower() and "alex chen" in prompt.lower():
#                 response = "Based on the commits, Alex Chen seems to be the primary contributor to the authentication service, implementing and streamlining OAuth2 support."
#             elif "payments api" in prompt.lower() and "performance regressions" in prompt.lower():
#                 response = "It appears Diana Wells made recent performance refinements to the payments API, optimizing currency conversion, potentially addressing earlier issues."
#             elif "diana wells" in prompt.lower() and "optimize" in prompt.lower():
#                 response = "Diana Wells contributed to optimizing database queries for user profiles and refined currency conversion in the payments API for high throughput."
#             elif "high complexity" in prompt.lower() and "recent" in prompt.lower():
#                 response = "One recent commit by Bob Johnson (hash d1e2f3g...) introduced new currency conversion logic to the payments API, which shows notable cyclomatic complexity."
#             else:
#                 response = "I have synthesized an answer based on the provided commit data. Please see the context for details."
#             return LLMResponse(response)

#     class LLMContextBuilder:
#         def __init__(self, max_tokens: int):
#             self.max_tokens = max_tokens

#         def build_context(self, commits: List[ExportedEnrichedCommitData]) -> str:
#             context_parts = []
#             for commit in commits:
#                 context_parts.append(f"Commit HASH: {commit.hash}")
#                 context_parts.append(f"Author: {commit.author} <{commit.author_email}>")
#                 context_parts.append(f"Date: {commit.author_date}")
#                 context_parts.append(f"Message:\n```\n{commit.message}\n```")
#                 for diff in commit.enriched_diffs:
#                     context_parts.append(f"Diff Snippet (File: {diff.file_path}, Type: {diff.metrics.change_type}, CC: {diff.metrics.cyclomatic_complexity}, SLOC: {diff.metrics.sloc}):")
#                     context_parts.append(f"```\n{diff.content}\n```")
#                 context_parts.append("---")
            
#             full_context = "\n".join(context_parts)
#             # Simple truncation, real context builders would prioritize important parts
#             if len(full_context) > self.max_tokens * 4: # Crude token estimate
#                 return full_context[:self.max_tokens * 4] + "\n... [Context truncated to fit LLM window] ..."
#             return full_context

#     class GitRepositoryParser:
#         """
#         Mock Git Repository Parser to provide dummy CommitData.
#         """
#         def __init__(self):
#             self.repo_path: Optional[str] = None
#             self.dummy_data: List[CommitData] = []
#             self._populate_dummy_data()

#         def set_repository(self, path: str):
#             self.repo_path = path
#             print(f"Mock Git parser set to repo: {path}")

#         def _populate_dummy_data(self):
#             self.dummy_data = [
#                 CommitData(
#                     hash="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
#                     author="Alex Chen",
#                     author_email="alex.chen@example.com",
#                     author_date=datetime.datetime(2023, 10, 26, 10, 0, 0),
#                     committer="Alex Chen",
#                     committer_email="alex.chen@example.com",
#                     committer_date=datetime.datetime(2023, 10, 26, 10, 0, 0),
#                     message="feat: Implement new authentication service with OAuth2 support.",
#                     diffs=[
#                         DiffSegment(file_path="src/services/auth_service.py", content="+def authenticate_oauth2():\n    # new auth logic\n    return {'status': 'success'}\n"),
#                         DiffSegment(file_path="src/api/payments_api.py", content=" # no changes here "),
#                     ]
#                 ),
#                 CommitData(
#                     hash="b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0",
#                     author="Diana Wells",
#                     author_email="diana.wells@example.com",
#                     author_date=datetime.datetime(2023, 11, 15, 14, 30, 0),
#                     committer="Diana Wells",
#                     committer_email="diana.wells@example.com",
#                     committer_date=datetime.datetime(2023, 11, 15, 14, 30, 0),
#                     message="fix: Optimize database queries for user profile retrieval, reducing latency.",
#                     diffs=[
#                         DiffSegment(file_path="src/db/user_model.py", content="-old_query = 'SELECT * FROM users'\n+optimized_query = 'SELECT id, name FROM users WHERE active=true'\nif user_id:\n    optimized_query += f' AND id={user_id}'\nreturn execute_query(optimized_query)\n"),
#                         DiffSegment(file_path="src/api/profile_api.py", content=" # updated docstring for profile endpoint "),
#                     ]
#                 ),
#                 CommitData(
#                     hash="c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
#                     author="Alex Chen",
#                     author_email="alex.chen@example.com",
#                     author_date=datetime.datetime(2024, 1, 5, 9, 0, 0),
#                     committer="Alex Chen",
#                     committer_email="alex.chen@example.com",
#                     committer_date=datetime.datetime(2024, 1, 5, 9, 0, 0),
#                     message="refactor: Streamline OAuth token refreshing mechanism, improving performance under load.",
#                     diffs=[
#                         DiffSegment(file_path="src/services/auth_service.py", content=" # improved token refresh logic with memoization\n+token = cache.get_or_set(user_id, fetch_new_token, expiry=3600)\nif token is None:\n    token = refresh_token(user_id)\nreturn token\n"),
#                         DiffSegment(file_path="src/config/security.py", content=" # minor adjustment to security headers "),
#                     ]
#                 ),
#                 CommitData(
#                     hash="d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0",
#                     author="Bob Johnson",
#                     author_email="bob.johnson@example.com",
#                     author_date=datetime.datetime(2024, 2, 1, 11, 0, 0),
#                     committer="Bob Johnson",
#                     committer_email="bob.johnson@example.com",
#                     committer_date=datetime.datetime(2024, 2, 1, 11, 0, 0),
#                     message="feat: Add new currency conversion logic to payments API. Initial implementation.",
#                     diffs=[
#                         DiffSegment(file_path="src/api/payments_api.py", content="+def convert_currency(amount, from_curr, to_curr):\n    # complex conversion rates logic with external API call\n    if amount < 0:\n        raise ValueError('Invalid amount')\n    rate = get_rate(from_curr, to_curr)\n    if rate is None: return None\n    return amount * rate\n"),
#                         DiffSegment(file_path="src/utils/currency_converter.py", content=" # new file created for helper functions "),
#                     ]
#                 ),
#                 CommitData(
#                     hash="e1f2g3h4i5j6k7l8m9n0o1p2q3r4s7t6u7v8w9x0", # Modified hash slightly to prevent duplication if run repeatedly
#                     author="Diana Wells",
#                     author_email="diana.wells@example.com",
#                     author_date=datetime.datetime(2024, 2, 10, 16, 0, 0),
#                     committer="Diana Wells",
#                     committer_email="diana.wells@example.com",
#                     committer_date=datetime.datetime(2024, 2, 10, 16, 0, 0),
#                     message="perf: Refine currency conversion in payments API for high throughput.",
#                     diffs=[
#                         DiffSegment(file_path="src/api/payments_api.py", content=" # optimized conversion call to use local cache first\n-rate = get_rate(from_curr, to_curr)\n+rate = cached_get_rate(from_curr, to_curr)\n"),
#                         DiffSegment(file_path="src/utils/currency_converter.py", content=" # caching added to currency conversion utility "),
#                     ]
#                 )
#             ]

#         def get_all_commit_data(self) -> List[CommitData]:
#             return self.dummy_data[:] # Return a copy


#     # 1. Configuration
#     system_config = ArcheologySystemConfig(
#         llm_api_key="YOUR_GEMINI_API_KEY", # Replace with actual key or env var
#         max_retrieved_commits=10
#     )

#     # 2. Initialize and Index
#     git_indexer = GitIndexerService(system_config)
    
#     # Simulate indexing of dummy data
#     # In a real scenario, this would be `git_indexer.index_repository("/path/to/your/git/repo")`
#     print("\n--- Simulating Indexing ---")
#     git_indexer.git_parser.set_repository("/mock/repo") # Set mock parser's repo path
#     all_raw_commits = git_indexer.git_parser.get_all_commit_data()

#     for raw_commit in all_raw_commits:
#         # Manually perform the enrichment and store in metadata_store
#         # This bypasses the full `index_repository` for simplified setup,
#         # but `index_repository` is the method to call for actual use.
#         enriched_diffs_for_commit: List[ExportedEnrichedDiffSegment] = []
#         full_diff_text_for_embedding_mock = []
#         for original_diff_seg in raw_commit.diffs:
#             metrics = git_indexer.complexity_analyzer.analyze_diff_segment(original_diff_seg)
#             enriched_diff = ExportedEnrichedDiffSegment(original_diff=original_diff_seg, metrics=metrics)
#             enriched_diffs_for_commit.append(enriched_diff)
#             full_diff_text_for_embedding_mock.append(original_diff_seg.content)
        
#         enriched_commit_data_mock = ExportedEnrichedCommitData(original_commit=raw_commit, enriched_diffs=enriched_diffs_for_commit)
#         git_indexer.metadata_store[raw_commit.hash] = enriched_commit_data_mock

#         # Also simulate adding embeddings (simplified)
#         git_indexer.vector_db_client.insert_vector(
#             vector_id=f"{raw_commit.hash}_msg",
#             vector=[0.1]*768, # Placeholder vector
#             metadata={"type": "message", "commit_hash": raw_commit.hash}
#         )
#         git_indexer.vector_db_client.insert_vector(
#             vector_id=f"{raw_commit.hash}_diff",
#             vector=[0.2]*768, # Placeholder vector
#             metadata={"type": "diff", "commit_hash": raw_commit.hash}
#         )
#     print("Mock indexing complete, metadata store populated.")


#     # 3. Initialize Query Service, Expertise Profiler, and Repository Health Monitor
#     archeologist = ArcheologistQueryService(system_config, git_indexer)
#     expertise_profiler = ExpertiseProfiler(git_indexer.metadata_store)
#     health_monitor = RepositoryHealthMonitor(git_indexer.metadata_store)

#     # 4. Perform Queries
#     print("\n--- Query 1: Main contributors to 'authentication' service in last 6 months ---")
#     query1 = "Who are the main contributors to the 'authentication' service in the last 6 months?"
#     answer1 = archeologist.query_repository_history(query1, last_n_months=6, path_filter="auth_service.py")
#     print(f"Answer: {answer1}")

#     print("\n--- Query 2: Commit that introduced performance regressions in payments API recently (high complexity) ---")
#     query2 = "Find the commit that introduced performance regressions in the payments API recently, focusing on complex changes."
#     answer2 = archeologist.query_repository_history(query2, last_n_months=3, path_filter="payments_api.py", min_complexity=5)
#     print(f"Answer: {answer2}")

#     print("\n--- Query 3: What changes did Diana Wells make to optimize the system? ---")
#     query3 = "What changes did Diana Wells make to optimize the system?"
#     answer3 = archeologist.query_repository_history(query3, author_filter="Diana Wells")
#     print(f"Answer: {answer3}")

#     # 5. Demonstrate new features
#     print("\n--- Expertise Profiler: Top experts for 'api' module ---")
#     top_api_experts = expertise_profiler.get_top_experts_for_path_or_topic("api", top_n=2)
#     print(f"Top API Experts: {top_api_experts}")

#     print("\n--- Repository Health Monitor: Recent complexity anomalies ---")
#     complexity_anomalies = health_monitor.detect_anomalies(metric_key='cyclomatic_complexity', lookback_days=90)
#     print(f"Recent Complexity Anomalies: {complexity_anomalies}")

#     print("\n--- Repository Health Monitor: Recent SLOC anomalies ---")
#     sloc_anomalies = health_monitor.detect_anomalies(metric_key='sloc', lookback_days=90)
#     print(f"Recent SLOC Anomalies: {sloc_anomalies}")
```

**Claims:**

1.  A system for facilitating semantic-cognitive archeology within a distributed version control repository, comprising:
    a.  A **Commit Stream Extractor** module configured to programmatically interface with a target distributed version control repository and obtain a chronological stream of commit objects, each uniquely identified by a cryptographic hash.
    b.  A **Commit Data Parser** module coupled to the Commit Stream Extractor, configured to extract granular metadata from each commit object, including but not limited to authorial identity, temporal markers (author date, committer date), and the comprehensive commit message.
    c.  A **Diff Analyzer** module coupled to the Commit Data Parser, configured to generate and process line-level code changes (diffs) associated with each commit, and optionally to extract higher-order structural code elements via language-specific Abstract Syntax Tree (AST) parsing.
    d.  A **Semantic Encoding** module comprising:
        i.  A **Commit Message Encoder** configured to transform each commit message into a high-dimensional numerical vector embedding, capturing its latent semantic meaning.
        ii. A **Code Diff Encoder** configured to transform the processed code changes (diffs) into one or more high-dimensional numerical vector embeddings, capturing the semantic intent and impact of the code modification.
    e.  A **Data Persistence Layer** comprising:
        i.  A **Vector Database** configured for the efficient storage and Approximate Nearest Neighbor (ANN) retrieval of the generated vector embeddings.
        ii. A **Metadata Store** configured for the structured storage of all non-vector commit metadata and original content, including raw commit messages and diffs, linked to their corresponding commit hashes.
    f.  A **Query Semantic Encoder** module configured to receive a natural language query from a user and transform it into a high-dimensional numerical vector embedding.
    g.  A **Vector Database Query Engine** module coupled to the Query Semantic Encoder and the Vector Database, configured to perform a multi-modal semantic search by comparing the query embedding against the stored commit message and code diff embeddings, thereby identifying a ranked set of epistemologically relevant commit hashes.
    h.  A **Context Assembler** module coupled to the Vector Database Query Engine and the Metadata Store, configured to retrieve the full metadata and original content for the identified relevant commits and dynamically compile them into a coherent, token-optimized contextual payload.
    i.  A **Generative AI Model Orchestrator** module coupled to the Context Assembler, configured to construct a meticulously engineered prompt comprising the user's original query and the contextual payload, and to transmit this prompt to a sophisticated **Large Language Model (LLM)**.
    j.  The Large Language Model (LLM) configured to receive the engineered prompt, perform a cognitive analysis of the provided context, and synthesize a direct, comprehensive, natural language answer to the user's query, strictly predicated upon the provided contextual provenance.
    k.  A **User Interface** module configured to receive and display the synthesized answer to the user.

2.  The system of claim 1, wherein the Semantic Encoding module utilizes transformer-based neural networks for the generation of vector embeddings, specifically adapted for both natural language text and programming language source code.

3.  The system of claim 1, further comprising a **Temporal Filtering Module** integrated into the Query Phase, configured to filter or re-rank relevant commits based on specified temporal criteria, such as recency or date ranges.

4.  The system of claim 1, further comprising an **Authorial Attribution Module** configured to analyze commit histories to infer and rank authorial expertise for specific code modules, file paths, or semantic topics based on quantitative and qualitative contribution metrics.

5.  A method for performing semantic-cognitive archeology on a distributed version control repository, comprising the steps of:
    a.  **Ingestion:** Programmatically traversing the complete history of a target repository to extract discrete commit objects.
    b.  **Parsing:** Deconstructing each commit object into its constituent metadata (author, date, message) and code changes (diffs).
    c.  **Embedding:** Generating high-dimensional vector representations for both the commit messages and the code changes, using advanced neural network models.
    d.  **Persistence:** Storing these vector embeddings in an optimized vector database and all associated metadata and original content in a separate metadata store, maintaining explicit linkages between them.
    e.  **Query Encoding:** Receiving a natural language query from a user and transforming it into a high-dimensional vector embedding.
    f.  **Semantic Retrieval:** Executing a multi-modal semantic search within the vector database using the query embedding, to identify and retrieve a ranked set of semantically relevant commit hashes.
    g.  **Context Formulation:** Assembling a coherent textual context block by fetching the full details of the retrieved commits from the metadata store.
    h.  **Cognitive Synthesis:** Submitting the formulated context and the original query to a pre-trained Large Language Model (LLM) as an engineered prompt.
    i.  **Response Generation:** Receiving a synthesized, natural language answer from the LLM, which directly addresses the user's query based solely on the provided commit context.
    j.  **Presentation:** Displaying the synthesized answer to the user via a user-friendly interface.

6.  The method of claim 5, wherein the embedding step (c) involves employing different specialized transformer models for natural language commit messages and for programming language code changes, respectively.

7.  The method of claim 5, further comprising the step of **Dynamic Context Adjustment**, wherein the size and content of the assembled context block (g) are adaptively adjusted based on the LLM's token window limitations and the perceived relevance density of the retrieved commit data.

**Mathematical Justification:**

The foundational rigor of the Semantic-Cognitive Archeology System for Distributed Version Control Systems is underpinned by sophisticated mathematical constructs, each deserving of comprehensive treatment as a distinct domain of inquiry.

### I. The Theory of High-Dimensional Semantic Embedding Spaces: `E(x)`

Let `D` be the domain of all possible textual and code sequences, and `R^d` be a `d`-dimensional Euclidean vector space. The embedding function `E: D -> R^d` maps an input sequence `x in D` to a dense vector representation `v_x in R^d`. This mapping is not arbitrary; it is meticulously constructed such that semantic similarity in the original domain `D` is approximately preserved as geometric proximity in the embedding space `R^d`.

**I.A. Foundations of Transformer Architectures for `E(x)`:**
At the core of `E(x)` lies the **Transformer architecture**, a revolutionary deep neural network paradigm, notably eschewing recurrent (RNN) or convolutional (CNN) layers in favor of a powerful mechanism termed "self-attention."

1.  **Tokenization and Input Representation:**
    An input sequence `x` (e.g., a commit message or a code diff) is first tokenized into a sequence of subword units `x = {t_1, t_2, ..., t_L}`, where `L` is the sequence length. Each token `t_i` is mapped to a fixed-size embedding vector `e_i_token`. To imbue the model with positional awareness, a **Positional Encoding** `p_i` is added to each token embedding, yielding the input vector `z_i^0 = e_i_token + p_i`. The positional encoding typically uses sine and cosine functions of varying frequencies:
    ```
    PE_[pos, 2i] = sin(pos / 10000^[2i/d_model])
    ```
    ```
    PE_[pos, 2i+1] = cos(pos / 10000^[2i/d_model])
    ```
    where `pos` is the position and `i` is the dimension.

2.  **Multi-Head Self-Attention (MHSA):**
    The fundamental building block of the Transformer is the self-attention mechanism, which computes a weighted sum of input features, with weights determined by the similarity of features within the input sequence itself. For an input sequence of vectors `Z = [z_1, ..., z_L]`, three learned weight matrices are applied: `W^Q, W^K, W^V in R^(d_model x d_k)` (for query, key, value projections), where `d_k` is the dimension of the query/key.
    The attention scores for a single "head" are computed as:
    ```
    Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
    ```
    where `Q = Z W^Q`, `K = Z W^K`, `V = Z W^V`.
    **Multi-Head Attention** applies this mechanism `h` times in parallel with different learned projections, then concatenates their outputs, and linearly transforms them:
    ```
    MultiHead(Z) = Concat(head_1, ..., head_h) W^O
    ```
    where `head_j = Attention(Z W^Q_j, Z W^K_j, Z W^V_j)`.

3.  **Feed-Forward Networks and Residual Connections:**
    Each attention layer is followed by a position-wise feed-forward network (FFN) and layer normalization, with residual connections aiding gradient flow:
    ```
    FFN(y) = ReLU(y W_1 + b_1) W_2 + b_2
    ```
    The output of each sub-layer (attention or FFN) is `LayerNorm(x + Sublayer(x))`.

4.  **Embedding Generation:**
    For sequence embeddings, often the representation of a special `[CLS]` token (added during tokenization) from the final Transformer layer is used, or a mean-pooling operation is applied over all token representations:
    ```
    v_x = MeanPool(z_1^N, ..., z_L^N)
    ```
    where `N` is the number of Transformer layers.
    The training objective for such models often involves contrastive learning (e.g., maximizing similarity of semantically related pairs and minimizing for unrelated pairs), masked language modeling (MLM), or next sentence prediction (NSP) for pre-training on vast corpora. This ensures that the generated vectors encode rich semantic information.

**I.B. Code-Specific Embeddings:**
For code diffs, `E(x)` can be augmented with specialized models (e.g., CodeBERT) that integrate syntactic information (from ASTs) or type information during pre-training, enabling them to understand programming language structure and semantics beyond plain text. The tokenization process may incorporate programming language-specific tokens or even graph-based representations of code.

### II. The Calculus of Semantic Proximity: `cos_dist(u, v)`

Given two `d`-dimensional non-zero vectors `u, v in R^d`, representing embeddings of two sequences, their semantic proximity is quantified by the **Cosine Similarity**, which measures the cosine of the angle between them. The closer the cosine value is to 1, the smaller the angle, and thus the higher their semantic similarity.

**II.A. Definition and Geometric Interpretation:**
The cosine similarity `cos_sim(u, v)` is defined as:
```
cos_sim(u, v) = (u . v) / (||u|| ||v||) = (sum_[i=1]^d u_i v_i) / (sqrt(sum_[i=1]^d u_i^2) sqrt(sum_[i=1]^d v_i^2))
```
where `u . v` is the dot product, and `||u||` denotes the Euclidean (L2) norm of vector `u`.
The **Cosine Distance** `cos_dist(u, v)` is then typically defined as:
```
cos_dist(u, v) = 1 - cos_sim(u, v)
```
This distance metric ranges from 0 (perfect similarity, angle 0Â°) to 2 (perfect dissimilarity, angle 180Â°), with 1 indicating orthogonality (no discernible relationship).
Geometrically, it focuses on the orientation of vectors rather than their magnitude. This is particularly advantageous for semantic embeddings where the length of a vector might not carry direct semantic meaning but its direction in the high-dimensional space does. The embedding space is often normalized such that vectors lie on a hypersphere, making cosine similarity directly equivalent to Euclidean distance.

**II.B. Properties and Advantages:**
*   **Scale Invariance:** Cosine similarity is invariant to scaling of vectors. If `u` is scaled by a factor `alpha > 0`, `cos_sim(alpha u, v) = cos_sim(u, v)`. This is crucial as embedding magnitudes can vary without affecting semantic content.
*   **Computational Efficiency:** For dense vectors, it's computationally efficient.
*   **Effectiveness in High Dimensions:** It performs well in high-dimensional spaces, where traditional Euclidean distance can become less meaningful due to the "curse of dimensionality."

### III. The Algorithmic Theory of Semantic Retrieval: `F_semantic(q, H)`

Given a query embedding `v_q` and a set of `M` commit embeddings `H = {v_h_1, ..., v_h_M}`, the semantic retrieval function `F_semantic(q, H) -> H'' subseteq H` efficiently identifies a subset `H''` of commits whose embeddings are geometrically closest to `v_q` in the vector space, based on `cos_dist`. For large `M`, exact nearest neighbor search becomes computationally intractable (linear scan `O(Md)`). Thus, **Approximate Nearest Neighbor (ANN)** algorithms are employed.

**III.A. Locality Sensitive Hashing (LSH):**
One approach is LSH. It hashes data points such that points that are close to each other in the original space are mapped to the same "buckets" with high probability.
Let `h: R^d -> {0,1}^k` be a hash function that maps vectors to binary codes. For cosine similarity, hyperplanes are often used. For a random vector `r in R^d`:
```
h_r(v) = 1 if v . r >= 0
         0 if v . r < 0
```
Multiple such hash functions are combined into a hash family, allowing for probabilistic guarantees on finding neighbors.

**III.B. Quantization-Based Methods (e.g., IVFFlat):**
**Inverted File Index (IVF):** This method partitions the `d`-dimensional space into Voronoi cells, each represented by a centroid. During indexing, each commit embedding is assigned to its nearest centroid. At query time, the query vector's nearest centroids are found, and only commits within those corresponding cells are scanned.
1.  **Clustering:** Apply k-means clustering to the dataset `H` to obtain `k` centroids `C = {c_1, ..., c_k}`.
2.  **Assignment:** For each `v_h in H`, assign it to its nearest centroid `c_j`. This creates an inverted index mapping centroids to lists of assigned vectors.
3.  **Search:** Given query `v_q`, find its `k'` nearest centroids. Then, perform an exhaustive search *only* within the lists of vectors associated with these `k'` centroids.
```
H'' = U_[j in nearest k' centroids] {v_h | assign(v_h) = c_j}
```
**Product Quantization (PQ):** Further compresses vectors by dividing them into subvectors and quantizing each subvector independently.

**III.C. Graph-Based Methods (e.g., HNSW - Hierarchical Navigable Small World):**
These are currently state-of-the-art for ANN search. HNSW constructs a multi-layer graph where lower layers contain more nodes and denser connections, and higher layers contain fewer nodes and spars, long-range connections.
1.  **Graph Construction:** Nodes are vectors. Edges connect approximate nearest neighbors. The graph is built incrementally.
2.  **Search:** Start at a random entry point in the topmost (sparse) layer. Traverse greedily towards the query vector until a local minimum is found. Then, drop down to a lower layer and repeat. This allows for rapid traversal of large distances in higher layers and fine-grained search in lower layers.
The complexity is typically poly-logarithmic `O(log^c M)` in practice, offering excellent trade-offs between search speed and accuracy.

### IV. The Epistemology of Generative AI: `G_AI(H'', q)`

The generative model `G_AI(H'', q) -> A` is a highly sophisticated probabilistic system capable of synthesizing coherent and contextually relevant natural language text `A`, given a set of relevant commit contexts `H''` and the original query `q`. These models are predominantly built upon the Transformer architecture, scaled to unprecedented sizes.

**IV.A. Large Language Model (LLM) Architecture and Pre-training:**
LLMs are massive Transformer decoders (or encoder-decoder models) pre-trained on vast and diverse corpora of text (e.g., Common Crawl, Wikipedia, books, code).
The pre-training objective often involves predicting the next token in a sequence (causal language modeling) or filling in masked tokens. This objective, applied at scale, enables the model to learn:
*   **Syntax and Grammar:** The statistical regularities of language.
*   **Semantics:** The meaning of words and phrases in context.
*   **World Knowledge:** Information embedded in the training data.
*   **Reasoning Abilities:** Emergent capabilities to perform logical inference, analogy, and problem-solving, often through "chain-of-thought" processes.

**IV.B. Instruction Tuning and Reinforcement Learning from Human Feedback (RLHF):**
After pre-training, LLMs undergo crucial fine-tuning phases:
1.  **Instruction Tuning:** The model is fine-tuned on datasets of instructions and desired responses, teaching it to follow commands and generate helpful, harmless, and honest outputs.
2.  **RLHF:** A reward model, trained on human preferences for model outputs, provides feedback to the LLM. Using reinforcement learning (e.g., Proximal Policy Optimization - PPO), the LLM is further optimized to align its outputs with human values and preferences. This stage is critical for generating answers that are not only factually correct (based on context) but also well-structured, relevant, and easy to understand.

**IV.C. The Mechanism of Text Generation:**
Given a prompt `P = {q, H''}`, the LLM generates the answer `A = {a_1, a_2, ..., a_K}` token by token:
`P(a_k | a_1, ..., a_k-1, P)`
At each step `k`, the model computes a probability distribution over the entire vocabulary for the next token `a_k`, conditioned on the prompt and all previously generated tokens. Various decoding strategies are employed:
*   **Greedy Decoding:** Always picks the token with the highest probability.
*   **Beam Search:** Explores multiple high-probability sequences simultaneously, often leading to more coherent and fluent text.
*   **Temperature Sampling:** Introduces randomness to diversify outputs, by scaling the logits before softmax: `softmax(logits / T)`. Higher `T` leads to more creative/random outputs.
*   **Top-K/Top-P (Nucleus) Sampling:** Limits the vocabulary from which to sample, focusing on the most probable tokens.

The LLM, guided by the meticulously crafted prompt, leverages its vast pre-trained knowledge and fine-tuned instruction-following abilities to perform complex information extraction, synthesis, and summarization tasks over the provided commit data, culminating in a direct and insightful answer.

### Proof of Superiority: `H'' >> H'` and `G_AI(H'', q) -> A >> F_keyword(q, H) -> H'`

Let `H` be the complete set of commits in a repository.
Let `q` be a user's natural language query.

**I. Semantic Retrieval vs. Syntactic Keyword Matching:**
A traditional keyword search `F_keyword(q, H) -> H' subset H` identifies a subset of commits `H'` where the query `q` (or its substrings/keywords) is syntactically present in the commit metadata (messages, file paths). This is a purely lexical operation, ignoring the deeper meaning or intent.
```
H' = {h | keyword(q) subseteq textual_content(h)}
```

In contrast, the present invention employs a sophisticated semantic retrieval function `F_semantic(q, H) -> H'' subset H`. This function operates in a high-dimensional embedding space, where the query `q` is transformed into a vector `v_q` and each commit `h` is represented by vectors `v_M(h)` (message) and `v_D(h)` (diff). The retrieval criterion is based on geometric proximity, specifically cosine distance.
```
H'' = {h | cos_dist(v_q, v_M(h)) < epsilon_M or cos_dist(v_q, v_D(h)) < epsilon_D }
```

**Proof of Contextual Completeness:**
It is a well-established property of well-trained semantic embedding models that they can capture conceptual relationships (synonymy, hypernymy, meronymy) and contextual nuances that keyword matching entirely misses. For instance, a query for "performance degradation" might semantically match a commit message describing "latency optimization" (as a fix) or "increased processing time" (as an introduction), even if the exact phrase "performance degradation" is absent.
Therefore, the set of semantically relevant commits `H''` will intrinsically be a more comprehensive and accurate collection of historical artifacts pertaining to the user's intent than the syntactically matched set `H'`. Mathematically, the information content of `H''` related to `q` is demonstrably richer and more complete than `H'`.
```
for all q, there exist H'', H' such that Relevance(H'', q) >= Relevance(H', q) and often Relevance(H'', q) >> Relevance(H', q)
```
where `Relevance(X, q)` is a measure of how well the set `X` answers the implicit or explicit questions within `q`.
This implies `H''` can contain commits `h not in H'` that are highly relevant to `q`, thereby making `H''` a superior foundation for answering complex queries.

**II. Information Synthesis vs. Raw Document Listing:**
Traditional methods, at best, return a list of documents `H'` (commit messages, diffs). The user is then burdened with the cognitively demanding task of manually sifting through these documents, synthesizing information, identifying patterns, and formulating an answer. This process is time-consuming, error-prone, and scales poorly with repository size.

The present invention's system incorporates a generative AI model `G_AI`. This model is not merely a document retriever; it is an intelligent agent capable of performing sophisticated cognitive tasks:
1.  **Information Extraction:** Identifying key entities (authors, dates, file paths, functional changes) from the textual context of `H''`.
2.  **Pattern Recognition:** Detecting recurring themes, trends, or causal relationships across multiple commits.
3.  **Summarization and Synthesis:** Condensing vast amounts of disparate information into a concise, coherent, and direct answer.
4.  **Reasoning:** Applying its pre-trained knowledge and instruction-following abilities to reason about the implications of the code changes or messages in `H''` in response to `q`.

Thus, `G_AI(H'', q) -> A` produces a direct, synthesized answer `A`. This answer is a high-level abstraction of the information contained in `H''`, specifically tailored to the user's query `q`.
The value proposition of `A` (a direct answer) compared to `H'` (a list of raw documents) is orders of magnitude greater in terms of reducing human cognitive load and accelerating problem-solving.
`Value(A) >> Value(H')`
This superiority is self-evident from the fundamental difference in output: one is a solution, the other is raw material requiring further manual labor.

**Conclusion:** The combination of a robust semantic retrieval mechanism, which ensures a more complete and relevant contextual set `H''`, with a powerful generative AI model capable of cognitive synthesis, unequivocally proves the superior utility and effectiveness of the present invention over conventional methods. The system provides not just data, but actionable intelligence, thereby fundamentally transforming the landscape of software history analysis. `Q.E.D.`
```